import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-md backdrop-blur-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <span className="text-2xl font-bold text-softchat-700">Softchat</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks />
          <Button className="btn-primary" asChild>
            <a
              href="https://app.softchat.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Launch App
            </a>
          </Button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <Button className="btn-primary" asChild>
            <a
              href="https://app.softchat.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Launch App
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

// NavLinks component for reusability between desktop and mobile
const NavLinks = ({ mobile = false, closeMenu = () => {} }) => {
  const links = [
    { text: "Home", href: "/" },
    { text: "Features", href: "#features" },
    { text: "Why Softchat", href: "#why-softchat" },
    { text: "Blog", href: "/blog" },
    { text: "Newsletter", href: "#contact" },
  ];

  return (
    <>
      {links.map((link) => (
        <a
          key={link.text}
          href={link.href}
          className={`${
            mobile ? "block py-2 text-lg" : "text-sm font-medium"
          } text-gray-800 hover:text-softchat-600 transition-colors`}
          onClick={closeMenu}
        >
          {link.text}
        </a>
      ))}
    </>
  );
};

export default Header;
