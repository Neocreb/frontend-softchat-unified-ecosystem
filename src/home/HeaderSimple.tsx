import React from "react";

const HeaderSimple = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 shadow-md py-3">
      <div className="container-wide flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <span className="text-2xl font-bold text-blue-700">Softchat</span>
        </a>

        {/* Simple Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-sm font-medium text-gray-800 hover:text-blue-600"
          >
            Features
          </a>
          <a
            href="/blog"
            className="text-sm font-medium text-gray-800 hover:text-blue-600"
          >
            Blog
          </a>
          <a
            href="https://app.softchat.com"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Launch App
          </a>
        </nav>
      </div>
    </header>
  );
};

export default HeaderSimple;
