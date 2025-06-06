
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-softchat-700">Softchat</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks />
          <Button className="btn-primary" asChild>
            <a href="https://app.softchat.com" target="_blank" rel="noopener noreferrer">
              Launch App
            </a>
          </Button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden p-2" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <NavLinks mobile={true} closeMenu={() => setIsMobileMenuOpen(false)} />
            <Button className="btn-primary w-full" asChild>
              <a href="https://app.softchat.com" target="_blank" rel="noopener noreferrer">
                Launch App
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

// NavLinks component for reusability between desktop and mobile
const NavLinks = ({ mobile = false, closeMenu = () => {} }) => {
  const links = [
    { text: "Home", href: "/" },
    { text: "Features", href: "/#features" },
    { text: "Blog", href: "/blog" },
    { text: "Contact", href: "/#contact" },
  ];

  return (
    <>
      {links.map((link) => (
        <Link 
          key={link.text}
          to={link.href}
          className={`${
            mobile ? 'block py-2 text-lg' : 'text-sm font-medium'
          } text-gray-800 hover:text-softchat-600 transition-colors`}
          onClick={closeMenu}
        >
          {link.text}
        </Link>
      ))}
    </>
  );
};

export default Header;
