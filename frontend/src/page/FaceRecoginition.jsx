import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addStudent } from "../redux/slice/studentSlice";

const FaceRecognition = () => {
  const webcamRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessTick, setShowSuccessTick] = useState(false);
  const dispatch = useDispatch();

  const capture = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) throw new Error("Failed to capture image.");

      const blob = await fetch(imageSrc).then((res) => res.blob());
      const file = new File([blob], "face.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post("http://localhost:5000/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.user) {
        setResult(response.data.user);
        dispatch(addStudent([response.data.user]));
        setShowSuccessTick(true);
        setTimeout(() => setShowSuccessTick(false), 2000);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setResult(false);
      } else if (err.response) {
        setError(err.response.data?.error || "Recognition failed. Try again.");
      } else if (err.request) {
        setError("No response from server. Check your network.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl relative">
        {/* Header */}
        <motion.h1
          className="text-4xl font-extrabold text-gray-800 mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Face Recognition System
        </motion.h1>

        {/* Camera Section */}
        <motion.div
          className="relative rounded-2xl overflow-hidden shadow-md mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {cameraOpen ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-2xl"
            />
          ) : (
            <div className="h-72 flex items-center justify-center bg-gray-100">
              <p className="text-gray-500 text-lg">Camera is off</p>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCameraOpen(!cameraOpen)}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md transition-all"
          >
            {cameraOpen ? "Stop Camera" : "Open Camera"}
          </motion.button>

          {cameraOpen && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={capture}
              disabled={loading}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Recognizing...
                </span>
              ) : (
                "Recognize Face"
              )}
            </motion.button>
          )}
        </div>

        {/* Result Section */}
        <AnimatePresence>
          {(result !== null || error) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className={`p-6 rounded-2xl border ${
                error
                  ? "bg-red-50 border-red-300"
                  : result && result !== false
                  ? "bg-green-50 border-green-300"
                  : "bg-yellow-50 border-yellow-300"
              }`}
            >
              {error ? (
                <p className="text-red-700 font-medium">{error}</p>
              ) : result && result !== false ? (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-green-700">
                    ✅ Attendance Marked!
                  </h3>
                  <p className="text-gray-800">
                    <span className="font-medium">Name:</span> {result.name}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Roll Number:</span>{" "}
                    {result.roll_number}
                  </p>
                </div>
              ) : (
                <p className="text-yellow-700 font-medium">
                  ⚠️ No matching face found in the database
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccessTick && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="fixed flex-col gap-4 inset-0 flex items-center justify-center z-50"
            >
              <div className=" bg-slate-50 rounded-full p-8 shadow-2xl relative">
                <motion.svg
                  className="w-20 h-20  text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </div>
              
              <div className="absolute inset-0 bg-black opacity-40" />
                <h2 className="mt-4 text-2xl font-bold text-green-500 text-center">
                  Attendance Successfully Marked!
                </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FaceRecognition;
