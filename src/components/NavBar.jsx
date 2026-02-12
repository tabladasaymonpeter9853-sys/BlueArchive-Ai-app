import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 flex items-center gap-8 px-10 py-4 bg-sky-300/70 backdrop-blur-md border-b border-white/20">
      <Link to="/" className="text-gray-700 font-serif text-xl hover:text-sky-600 transition">Home</Link>
      <Link to="/about" className="text-gray-700 font-serif text-xl hover:text-sky-600 transition">About</Link>
    </nav>
  );
};

export default Navbar;