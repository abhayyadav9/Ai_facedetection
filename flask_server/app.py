import os
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import numpy as np
import face_recognition
from dotenv import load_dotenv
import os


load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient("mongodb+srv://yadav45abhay:facedetection@cluster0.dcktx.mongodb.net/facedetection?retryWrites=true&w=majority")
db = client["facedetection"]
users_collection = db.users


@app.route("/check")
def home():
    return "Hello from Flask on Vercel!"

def get_face_encoding(image_path):
    image = face_recognition.load_image_file(image_path)
    face_encodings = face_recognition.face_encodings(image)
    return face_encodings



@app.route('/', methods=['GET'])
def check_server():
    print("server is running on vercel")



@app.route('/register', methods=['POST'])
def register_user():
    try:
        # Get form data - fixed 'role_number' to 'roll_number'
        name = request.form.get('name')
        roll_number = request.form.get('roll_number')  # Fixed typo from 'role_number'
        phone = request.form.get('phone')
        email = request.form.get('email')
        age = request.form.get('age')
        image = request.files.get('image')

        # Validate all required fields
        required_fields = {
            'name': name,
            'roll_number': roll_number,
            'phone': phone,
            'email': email,
            'age': age,
            'image': image
        }
        
        # Check for missing fields
        missing_fields = [field for field, value in required_fields.items() if not value]
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        # Additional validation
        try:
            age = int(age)
            if age < 1:
                return jsonify({'error': 'Age must be a positive number'}), 400
        except ValueError:
            return jsonify({'error': 'Age must be a valid number'}), 400

        # Save temporary image file
        temp_image_path = f"temp_{image.filename}"
        image.save(temp_image_path)

        # Get face encoding
        face_encodings = get_face_encoding(temp_image_path)
        
        if not face_encodings:  # Check if empty
            os.remove(temp_image_path)
            return jsonify({'error': 'No face detected in the image'}), 400
        if len(face_encodings) > 1:
            os.remove(temp_image_path)
            return jsonify({'error': 'Multiple faces detected in the image'}), 400

        # Convert numpy array to list for storage
        face_encoding_list = face_encodings[0].tolist()

        # Encode image to base64
        with open(temp_image_path, "rb") as img_file:
            encoded_image = base64.b64encode(img_file.read()).decode('utf-8')

        # Prepare user data for MongoDB
        user_data = {
            'name': name,
            'roll_number': roll_number,
            'phone': phone,
            'email': email,
            'age': age,
            'face_encoding': face_encoding_list,
            'image': encoded_image
        }

        # Insert into MongoDB
        result = users_collection.insert_one(user_data)
        user_data['_id'] = str(result.inserted_id)

        # Clean up temporary file
        os.remove(temp_image_path)

        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'name': user_data['name'],
                'roll_number': user_data['roll_number'],
                'phone': user_data['phone'],
                'email': user_data['email'],
                'age': user_data['age'],
                'image': user_data['image']
            }
        }), 201

    except FileNotFoundError:
        return jsonify({'error': 'Error processing image file'}), 500
    except Exception as e:
        # Clean up temporary file if it exists
        if 'temp_image_path' in locals() and os.path.exists(temp_image_path):
            os.remove(temp_image_path)
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
    
    
    
    
    
    
    
    
    
    
@app.route('/detect', methods=['POST'])
def detect_user():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        image = request.files['image']
        temp_image_path = f"temp_detect_{image.filename}"
        image.save(temp_image_path)

        # Get face encoding from uploaded image
        detected_encodings = get_face_encoding(temp_image_path)
        os.remove(temp_image_path)

        if not detected_encodings:
            return jsonify({'error': 'No face detected'}), 400

        # Get all registered users
        registered_users = list(users_collection.find({}))

        for user in registered_users:
            stored_encoding = np.array(user['face_encoding'])
            
            # Compare faces
            matches = face_recognition.compare_faces(
                [stored_encoding],
                detected_encodings[0],
                tolerance=0.4
            )

            if True in matches:
                # Return user details without sensitive data
                return jsonify({
                    'user': {
                        'name': user['name'],
                        'roll_number': user['roll_number'],

                        'email': user['email'],
                        'phone': user['phone'],
                        'age': user['age'],
                        'image': user['image']
                    }
                }), 200

        return jsonify({'message': 'No matching user found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
    
# #automatic matiching algorithm
# @app.route('/matching', methods=['POST'])
# def detect_user():
#     try:
#         # Check if the image is provided as a file (multipart/form-data)
#         if 'image' in request.files:
#             image = request.files['image']
#             temp_image_path = f"temp_detect_{image.filename}"
#             image.save(temp_image_path)
#         # Otherwise, check if it's provided as a base64-encoded JSON property
#         elif request.is_json and 'image' in request.json:
#             image_data = request.json['image']
#             # Remove header if present (e.g. "data:image/jpeg;base64,")
#             if ',' in image_data:
#                 image_data = image_data.split(",")[-1]
#             temp_image_path = "temp_detect.jpg"
#             with open(temp_image_path, "wb") as f:
#                 f.write(base64.b64decode(image_data))
#         else:
#             return jsonify({'error': 'No image provided'}), 400

#         # Get face encoding from the saved image
#         detected_encodings = get_face_encoding(temp_image_path)
#         os.remove(temp_image_path)

#         if not detected_encodings:
#             return jsonify({'error': 'No face detected'}), 400

#         # Get all registered users from your database
#         registered_users = list(users_collection.find({}))

#         for user in registered_users:
#             stored_encoding = np.array(user['face_encoding'])
            
#             # Compare the detected face with stored encoding
#             matches = face_recognition.compare_faces(
#                 [stored_encoding],
#                 detected_encodings[0],
#                 tolerance=0.4
#             )

#             if True in matches:
#                 # Return the matching user's details (without sensitive data)
#                 return jsonify({
#                     'user': {
#                         'name': user['name'],
#                         'roll_number': user['roll_number'],
#                         'email': user['email'],
#                         'phone': user['phone'],
#                         'age': user['age'],
#                         'image': user['image']
#                     }
#                 }), 200

#         return jsonify({'message': 'No matching user found'}), 404

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500





@app.route('/')
def home():
    return "Hello, Render!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
