import os
import base64
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from deepface import DeepFace
import cv2

app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient("mongodb+srv://yadav45abhay:facedetection@cluster0.dcktx.mongodb.net/facedetection?retryWrites=true&w=majority")
db = client["facedetection"]
users_collection = db.users


@app.route("/check")
def check():
    return "Hello from Flask with DeepFace!"


# Utility: decode base64 image → cv2 image
def decode_base64_image(base64_string):
    try:
        img_data = base64.b64decode(base64_string.split(",")[-1])
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print("Decode error:", e)
        return None


@app.route("/", methods=["GET"])
def check_server():
    return "Server running with DeepFace!"


# ------------------ REGISTER -------------------
@app.route("/register", methods=["POST"])
def register_user():
    try:
        name = request.form.get("name")
        roll_number = request.form.get("roll_number")
        phone = request.form.get("phone")
        email = request.form.get("email")
        age = request.form.get("age")
        image = request.files.get("image")

        # Validation
        required_fields = {
            "name": name,
            "roll_number": roll_number,
            "phone": phone,
            "email": email,
            "age": age,
            "image": image
        }
        missing_fields = [f for f, v in required_fields.items() if not v]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        try:
            age = int(age)
            if age < 1:
                return jsonify({"error": "Age must be positive"}), 400
        except ValueError:
            return jsonify({"error": "Age must be a number"}), 400

        # Save image temporarily
        temp_image_path = f"temp_{image.filename}"
        image.save(temp_image_path)

        # Validate that at least one face is detected
        try:
            DeepFace.extract_faces(temp_image_path, detector_backend="opencv", enforce_detection=True)
        except Exception:
            os.remove(temp_image_path)
            return jsonify({"error": "No valid face detected in image"}), 400

        # Encode image to base64
        with open(temp_image_path, "rb") as img_file:
            encoded_image = base64.b64encode(img_file.read()).decode("utf-8")

        # Store user data
        user_data = {
            "name": name,
            "roll_number": roll_number,
            "phone": phone,
            "email": email,
            "age": age,
            "image": encoded_image
        }

        result = users_collection.insert_one(user_data)
        user_data["_id"] = str(result.inserted_id)

        os.remove(temp_image_path)

        return jsonify({
            "message": "User registered successfully",
            "user": {
                "name": user_data["name"],
                "roll_number": user_data["roll_number"],
                "phone": user_data["phone"],
                "email": user_data["email"],
                "age": user_data["age"],
                "image": user_data["image"]
            }
        }), 201

    except Exception as e:
        if "temp_image_path" in locals() and os.path.exists(temp_image_path):
            os.remove(temp_image_path)
        return jsonify({"error": str(e)}), 500


# ------------------ DETECT (single check) -------------------
@app.route("/detect", methods=["POST"])
def detect_user():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image provided"}), 400

        image = request.files["image"]
        temp_image_path = f"temp_detect_{image.filename}"
        image.save(temp_image_path)

        # Validate face
        try:
            DeepFace.extract_faces(temp_image_path, detector_backend="opencv", enforce_detection=True)
        except Exception:
            os.remove(temp_image_path)
            return jsonify({"error": "No face detected"}), 400

        registered_users = list(users_collection.find({}))

        for user in registered_users:
            # decode stored base64 image
            stored_img = decode_base64_image(user["image"])

            if stored_img is None:
                continue

            try:
                result = DeepFace.verify(
                    img1_path=temp_image_path,
                    img2_path=stored_img,
                    model_name="Facenet",
                    enforce_detection=False
                )
                if result["verified"]:
                    os.remove(temp_image_path)
                    return jsonify({
                        "user": {
                            "name": user["name"],
                            "roll_number": user["roll_number"],
                            "email": user["email"],
                            "phone": user["phone"],
                            "age": user["age"],
                            "image": user["image"]
                        }
                    }), 200
            except Exception:
                continue

        os.remove(temp_image_path)
        return jsonify({"message": "No matching user found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------ AUTO MATCHING -------------------
@app.route("/matching", methods=["POST"])
def matching_user():
    try:
        if "image" in request.files:
            image = request.files["image"]
            temp_image_path = f"temp_match_{image.filename}"
            image.save(temp_image_path)
        elif request.is_json and "image" in request.json:
            image_data = request.json["image"]
            if "," in image_data:
                image_data = image_data.split(",")[-1]
            temp_image_path = "temp_match.jpg"
            with open(temp_image_path, "wb") as f:
                f.write(base64.b64decode(image_data))
        else:
            return jsonify({"error": "No image provided"}), 400

        # Validate face
        try:
            DeepFace.extract_faces(temp_image_path, detector_backend="opencv", enforce_detection=True)
        except Exception:
            os.remove(temp_image_path)
            return jsonify({"error": "No face detected"}), 400

        registered_users = list(users_collection.find({}))

        for user in registered_users:
            stored_img = decode_base64_image(user["image"])
            if stored_img is None:
                continue

            try:
                result = DeepFace.verify(
                    img1_path=temp_image_path,
                    img2_path=stored_img,
                    model_name="Facenet",
                    enforce_detection=False
                )
                if result["verified"]:
                    os.remove(temp_image_path)
                    return jsonify({
                        "user": {
                            "name": user["name"],
                            "roll_number": user["roll_number"],
                            "email": user["email"],
                            "phone": user["phone"],
                            "age": user["age"],
                            "image": user["image"]
                        }
                    }), 200
            except Exception:
                continue

        os.remove(temp_image_path)
        return jsonify({"message": "No matching user found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    return "Hello, Render with DeepFace!"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
