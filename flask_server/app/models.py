from datetime import datetime
from . import mongo
from pymongo import MongoClient
from flask import current_app as app

def get_db():
    client = MongoClient(app.config['MONGO_URI'])
    return client.face_detection_db

def insert_image(file_path, filename, name, email, phone, age):
    try:
        result = mongo.db.users.insert_one({
            "filename": filename,
            "file_path": file_path,
            "name": name,
            "email": email,
            "phone": phone,
            "age": age,
            "created_at": datetime.utcnow()
        })
        return str(result.inserted_id)
    except Exception as e:
        raise RuntimeError(f"Database error: {str(e)}")
    
    
    
def get_image(file_name):
    db = get_db()
    return db.images.find_one({"file_name": file_name})