import { Link } from "react-router-dom";
import SoftchatLogo from "@/components/shared/SoftchatLogo";
import BubbleFall from "@/components/BubbleFall";



const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-fade-in">
      {/* Navbar */}
      <header className="flex h-20 items-center px-4 lg:px-6 border-b bg-white shadow-md sticky top-0 z-50 animate-slide-in-down duration-500">
        <div className="flex items-center gap-2 ml-10">
          <SoftchatLogo className="h-9 w-9" />
          <span className="font-bold text-2xl text-blue-600">Softchat</span>
        </div>
        <nav className="ml-auto mr-10 space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link
            to="/auth"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative flex-grow flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
  <BubbleFall />
  <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 z-10 flex flex-wrap justify-center">
  {Array.from("Welcome to Softchat").map((char, i) => (
    <span
      key={i}
      className={`animate-bounce-color inline-block`}
      style={{
        animationDelay: `${i * 0.9}s`,
        animationDuration: "2s",
        animationIterationCount: "infinite",
        animationTimingFunction: "ease-in-out",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ))}
</h2>




        <p className="text-xl text-gray-600 max-w-2xl mb-8 z-10 animate-fade-in-up">
          A seamless, secure, and smart platform for real-time communication, collaboration, and connection.
        </p>
        <Link
          to="/auth"
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg px-8 py-3 rounded-full shadow-xl hover:scale-110 transform transition duration-300 z-10"
        >
          Join Now
        </Link>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4">
        &copy; {new Date().getFullYear()} Softchat. Built with 💙 by the team.
      </footer>
    </div>
  );
};

export default LandingPage;
