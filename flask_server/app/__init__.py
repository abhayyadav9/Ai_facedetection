from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import os
from flask import jsonify


mongo = PyMongo()

def create_app():
    app = Flask(__name__)
 
    
    
    # Configuration
    app.config['MONGO_URI'] = 'mongodb+srv://yadav45abhay:facedetection@cluster0.dcktx.mongodb.net/facedetection?retryWrites=true&w=majority'
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads')
    
    # Initialize extensions
    mongo.init_app(app)
    CORS(app)
      

    
    # Create upload directory
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Register blueprints
    from .routes import bp
    app.register_blueprint(bp) 

    return app