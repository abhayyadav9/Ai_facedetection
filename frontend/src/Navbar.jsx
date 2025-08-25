import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-700 shadow-md fixed w-full z-50 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Menu */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img className="h-10 w-10" src="/logo.png" alt="Logo" />
              <span className="ml-3 font-bold text-2xl text-white">BrandName</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-white hover:text-gray-300 border-b-2 border-transparent hover:border-white transition"
              >
                Home
              </Link>
              <Link
                to="/face-recoginition"
                className="inline-flex items-center px-1 pt-1 text-white hover:text-gray-300 border-b-2 border-transparent hover:border-white transition"
              >
                Recognition
              </Link>
              <Link
                to="/registration"
                className="inline-flex items-center px-1 pt-1 text-white hover:text-gray-300 border-b-2 border-transparent hover:border-white transition"
              >
                Registration
              </Link>
              <Link
                to="/attendance-table"
                className="inline-flex items-center px-1 pt-1 text-white hover:text-gray-300 border-b-2 border-transparent hover:border-white transition"
              >
                Attendance
              </Link>
              <Link
                to="/automatic-matching"
                className="inline-flex items-center px-1 pt-1 text-white hover:text-gray-300 border-b-2 border-transparent hover:border-white transition"
              >
                Autmatic
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-1 pt-1 text-white hover:text-gray-300 border-b-2 border-transparent hover:border-white transition"
              >
                Contact
              </Link>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 focus:text-gray-300 transition"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-white bg-indigo-800 text-base font-medium text-white transition"
            >
              Home
            </Link>
            <Link
              to="/facerecognition"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-600 hover:border-white transition"
            >
              Recognition
            </Link>
            <Link
              to="/registration"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-600 hover:border-white transition"
            >
              Registration
            </Link>
            <Link
              to="/contact"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-600 hover:border-white transition"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
