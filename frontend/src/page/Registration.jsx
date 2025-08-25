import axios from 'axios';
import { useState } from 'react';

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roll_number: '',
    age: '',
    file: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file: file
      }));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);

    // Validate required fields
    const requiredFields = {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      roll_number: 'Roll Number',
      age: 'Age',
      file: 'Profile Picture'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key])
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    // Additional validation
    if (isNaN(formData.age) || formData.age < 1) {
      setError('Please enter a valid age');
      return;
    }

    // Email basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key === 'file' ? 'image' : key, formData[key]);
    });

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess(response.data);
      setFormData({
        name: '',
        roll_number: '',
        email: '',
        phone: '',
        age: '',
        file: null
      });
      // Reset file input
      document.querySelector('input[type="file"]').value = null;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-blue-300 to-purple-200 flex items-center justify-center p-4">
      <div className=" from-blue-300 to-purple-200 p-8 rounded-xl shadow-2xl mt-20 w-full max-w-md transform transition-all ">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Registration Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800"
                placeholder="Enter your name"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800"
                placeholder="Enter your email"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">U. Roll Number *</label>
              <input
                required
                type="number"
                name="roll_number"
                value={formData.roll_number}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800"
                placeholder="Enter roll number"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800"
                placeholder="Enter phone number"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
              <input
                required
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800"
                placeholder="Enter your age"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture *</label>
              <input
                required
                type="file"
                onChange={handleFileSelect}
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white hover:file:from-blue-600 hover:file:to-purple-600 transition-all duration-200"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
              <p className="text-green-700 text-sm font-medium">{success.message}</p>
              <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-green-800">
                <p><span className="font-medium">Name:</span> {success.user.name}</p>
                <p><span className="font-medium">Roll Number:</span> {success.user.roll_number}</p>
                <p><span className="font-medium">Email:</span> {success.user.email}</p>
                <p><span className="font-medium">Phone:</span> {success.user.phone}</p>
                <p><span className="font-medium">Age:</span> {success.user.age}</p>
                {success.user.image && (
                  <img
                    src={`data:image/jpeg;base64,${success.user.image}`}
                    alt="Profile"
                    className="mt-3 w-24 h-24 object-cover rounded-full border-2 border-green-200"
                  />
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-1"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Registration'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;