import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addStudent } from '../redux/slice/studentSlice';

const FaceRecognition = () => {
  const webcamRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [result, setResult] = useState(null); // null = no result, false = no match, or user object when matched
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessTick, setShowSuccessTick] = useState(false);
  const dispatch = useDispatch();

  const capture = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        throw new Error('Failed to capture image from webcam.');
      }

      const blob = await fetch(imageSrc).then(res => res.blob());
      const file = new File([blob], "face.jpg", { type: "image/jpeg" });
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:5000/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data && response.data.user) {
        setResult(response.data.user);
        dispatch(addStudent([response.data.user]));
        // Show success tick animation
        setShowSuccessTick(true);
        setTimeout(() => setShowSuccessTick(false), 2000); // Hide after 2 seconds
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setResult(false);
        } else {
          setError(err.response.data?.error || 'Recognition failed. Please try again.');
        }
      } else if (err.request) {
        setError('No response from server. Check your network.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl relative">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Face Recognition System
        </h1>

        <div className="space-y-6">
          <motion.div className="relative">
            {cameraOpen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl overflow-hidden"
              >
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-xl shadow-lg"
                />
              </motion.div>
            ) : (
              <div className="bg-gray-100 h-64 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Camera is off</p>
              </div>
            )}
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCameraOpen(!cameraOpen)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all transform hover:scale-105"
            >
              {cameraOpen ? 'Stop Camera' : 'Open Camera'}
            </button>

            {cameraOpen && (
              <button
                onClick={capture}
                disabled={loading}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? 'Recognizing...' : 'Recognize Face'}
              </button>
            )}
          </div>

          <AnimatePresence>
            {(result !== null || error) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-6 rounded-xl ${
                  error ? 'bg-red-50' : 
                  result && result !== false ? 'bg-green-50' : 'bg-yellow-50'
                }`}
              >
                {error ? (
                  <p className="text-red-600">{error}</p>
                ) : result && result !== false ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-green-800">Attendance Marked!</h3>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Name:</span> {result.name}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Roll Number:</span> {result.roll_number} {/* Fixed role_number to roll_number */}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-yellow-800">No matching face found in database</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Success Tick Popup */}
        <AnimatePresence>
          {showSuccessTick && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-full p-8 shadow-2xl">
                <motion.svg
                  className="w-16 h-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </div>
              <div className="absolute inset-0 bg-black opacity-30" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FaceRecognition;