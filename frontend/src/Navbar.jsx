import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-purple-700 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <motion.img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            />
            <motion.span
              className="font-extrabold text-2xl text-white tracking-wide"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Smart<span className="text-yellow-400">Attend</span>
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex space-x-8 ml-auto">
            {[
              { name: "Home", to: "/" },
              { name: "Recognition", to: "/face-recoginition" },
              { name: "Registration", to: "/registration" },
              { name: "Attendance", to: "/attendance-table" },
              { name: "Automatic", to: "/automatic-matching" },
              { name: "All Students", to: "/all-student" },
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.to}
                  className="text-white font-medium hover:text-yellow-300 border-b-2 border-transparent hover:border-yellow-300 transition-all duration-300"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-yellow-300 focus:outline-none"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <motion.div
          className="sm:hidden bg-indigo-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-2">
            {[
              { name: "Home", to: "/" },
              { name: "Recognition", to: "/face-recoginition" },
              { name: "Registration", to: "/registration" },
              { name: "Attendance", to: "/attendance-table" },
              { name: "Automatic", to: "/automatic-matching" },
              { name: "All Students", to: "/all-student" },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="block px-3 py-2 rounded-md text-white hover:bg-indigo-600 hover:text-yellow-300 transition-all"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
