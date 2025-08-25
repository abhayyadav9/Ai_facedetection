import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const FaceMatching = () => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const captureAndDetect = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Capture a screenshot from the webcam
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('Could not capture image from webcam.');
      }

      // Convert base64 image to a blob and then to a File object
      const blob = await fetch(imageSrc).then(res => res.blob());
      const file = new File([blob], "face.jpg", { type: "image/jpeg" });

      // Prepare FormData with the image file under the key "image"
      const formData = new FormData();
      formData.append('image', file);

      // Send POST request to the /detect endpoint
      const response = await axios.post('http://localhost:5000/matching', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // If a match is found, display the user details
      if (response.data && response.data.user) {
        setResult(response.data.user);
      } else if (response.data && response.data.message) {
        // When no matching user is found
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error("Detection error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-300 to-pink-300 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Face Recognition
        </h1>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 320,
            height: 240,
            facingMode: "user"
          }}
          className="rounded-lg shadow-md mx-auto"
        />
        <button
          onClick={captureAndDetect}
          disabled={loading}
          className="mt-6 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Detecting...' : 'Capture & Detect'}
        </button>
        {error && (
          <div className="mt-4 text-red-600 text-center">
            {error}
          </div>
        )}
        {result && (
          <div className="mt-4 p-4 border border-green-400 rounded-md">
            <h2 className="text-xl font-bold text-green-700 text-center mb-2">
              Match Found!
            </h2>
            <div className="text-left">
              <p><span className="font-medium">Name:</span> {result.name}</p>
              <p><span className="font-medium">Roll Number:</span> {result.roll_number}</p>
              <p><span className="font-medium">Email:</span> {result.email}</p>
              <p><span className="font-medium">Phone:</span> {result.phone}</p>
              <p><span className="font-medium">Age:</span> {result.age}</p>
              {result.image && (
                <img
                  src={`data:image/jpeg;base64,${result.image}`}
                  alt="Profile"
                  className="mt-4 w-32 h-32 object-cover rounded-full mx-auto border-2 border-green-500"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceMatching;
