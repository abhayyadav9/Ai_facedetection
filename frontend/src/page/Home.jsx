import React from 'react';
import { motion } from 'framer-motion';
import './Home.css'

const Home = () => {
  return (
    <div className="landing-container">
      {/* Header Section */}
      <header className="header">
        <motion.h1 
          className="logo"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          AI Attendance System
        </motion.h1>
        <nav className="navigation">
          <motion.a 
            href="#features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Features
          </motion.a>
          <motion.a 
            href="#about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            About
          </motion.a>
          <motion.a 
            href="#contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            Contact
          </motion.a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
        >
          <motion.h2 
            className="hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Revolutionize Your Attendance
          </motion.h2>
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            Experience the future of attendance with AI-powered insights and seamless integration.
          </motion.p>
          <motion.button 
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
