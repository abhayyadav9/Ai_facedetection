from flask import Blueprint, request, jsonify, current_app
from .utils import save_image, compare_faces
from .models import insert_image,get_image
import face_recognition
import os
bp = Blueprint('main', __name__)
bp = Blueprint('main', __name__)  # Blueprint name matches

@bp.route('/upload', methods=['POST'])
def upload_image():
    try:
        if 'multipart/form-data' not in request.content_type:
            return jsonify({"error": "Invalid content type"}), 400
        
        
        # Get form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        age = request.form.get('age', '').strip()

        # Validate required fields
        if not all([name, email, phone, age]):
            return jsonify({"error": "All fields are required"}), 400

        try:
            age = int(age)
            if age < 1:
                raise ValueError
        except ValueError:
            return jsonify({"error": "Invalid age format"}), 400

        # File handling
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Save file and insert to DB
        file_path, filename = save_image(file, current_app)
        insert_image(file_path, filename, name, email, phone, age)
        
        return jsonify({
            "message": "Upload successful",
            "filename": filename,
            "user": {"name": name, "email": email}
        }), 200

    except Exception as e:
        current_app.logger.error(f"Upload error: {str(e)}")
        return jsonify({"error": "Server processing error"}), 500


  
  
from flask import Blueprint, request, jsonify, current_app
from . import mongo  # Import the mongo instance directly
import face_recognition
import os

bp = Blueprint('main', __name__)
@bp.route('/detect_face', methods=['POST', 'OPTIONS'])
def detect_face():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Save temporary image
        temp_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'temp.jpg')
        file.save(temp_path)

        # Access MongoDB directly through the mongo instance
        users = list(mongo.db.users.find())
        
        if not users:
            return jsonify({"error": "No registered users"}), 404

        # Face recognition logic
        unknown_image = face_recognition.load_image_file(temp_path)
        unknown_encoding = face_recognition.face_encodings(unknown_image)
        
        if not unknown_encoding:
            os.remove(temp_path)
            return jsonify({"error": "No face detected"}), 400

        # Compare faces
        for user in users:
            if not os.path.exists(user['file_path']):
                continue
                
            known_image = face_recognition.load_image_file(user['file_path'])
            known_encoding = face_recognition.face_encodings(known_image)
            
            if known_encoding:
                results = face_recognition.compare_faces(
                    known_encoding, 
                    unknown_encoding[0],
                    tolerance=0.6
                )
                if any(results):
                    os.remove(temp_path)
                    return jsonify({
                        "match": True,
                        "user": {
                            "name": user['name'],
                            "email": user['email']
                        }
                    }), 200

        os.remove(temp_path)
        return jsonify({"match": False}), 200

    except Exception as e:
        current_app.logger.error(f"Detection error: {str(e)}")
        return jsonify({"error": "Server error"}), 500
    
    
def _build_cors_preflight_response():
    response = jsonify({"message": "Preflight Accepted"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    return response