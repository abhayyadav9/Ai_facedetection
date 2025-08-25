import face_recognition
import cv2
import os
from werkzeug.utils import secure_filename
from datetime import datetime

def save_image(file, app):
    try:
        # Validate file type
        filename = secure_filename(file.filename)
        if not allowed_file(filename, app.config['ALLOWED_EXTENSIONS']):
            raise ValueError("Invalid file type")
            
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{timestamp}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        file.save(file_path)
        return file_path, filename
    except Exception as e:
        raise RuntimeError(f"File save error: {str(e)}")

def allowed_file(filename, allowed_extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def compare_faces(image_path, camera):
    try:
        # Load known image with error handling
        known_image = face_recognition.load_image_file(image_path)
        known_encodings = face_recognition.face_encodings(known_image)
        
        if not known_encodings:
            raise ValueError("No faces found in the uploaded image")
            
        known_encoding = known_encodings[0]

        # Face comparison parameters
        max_attempts = 20  # ~5 seconds at 4 FPS
        match_threshold = 0.6
        
        for _ in range(max_attempts):
            success, frame = camera.read()
            if not success:
                break

            # Resize frame for faster processing
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            rgb_small_frame = small_frame[:, :, ::-1]

            # Find faces in current frame
            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

            for face_encoding in face_encodings:
                matches = face_recognition.compare_faces(
                    [known_encoding], 
                    face_encoding,
                    tolerance=match_threshold
                )
                if any(matches):
                    return True

            # Add slight delay between frames
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        return False
    except Exception as e:
        raise RuntimeError(f"Face comparison error: {str(e)}")
    finally:
        # Ensure camera is released
        camera.release()
        
        
        