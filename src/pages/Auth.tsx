import EnhancedAuthForm from "@/components/auth/EnhancedAuthForm";

const ChecklistItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-2 text-softchat-primary">
    <CheckIcon className="h-5 w-5 text-softchat-accent" />
    <span>{text}</span>
  </li>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const Auth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side */}
        <div className="hidden md:block w-full md:w-1/2 ml-5 p-6 sm:p-8 rounded-lg object-cover">
          <h2 className="text-2xl sm:text-4xl font-bold text-softchat-primary mb-2">Welcome to Softchat</h2>
          <p className="text-gray-800 mb-6 sm:mb-8">The unified ecosystem for social media, e-commerce, crypto, and rewards.</p>

          <ul className="space-y-4">
            <ChecklistItem text="Connect with friends and create content." />
            <ChecklistItem text="Shop securely in our marketplace." />
            <ChecklistItem text="Learn crypto trading risk-free." />
            <ChecklistItem text="Earn rewards for everything you do." />
          </ul>
          <img
            src="/auth.webp"
            alt="Auth"
            className="w-[40rem] h-[20rem] mt-5 object-cover"
          />
        </div>

        {/* Right Side (Hidden on mobile) */}
        <div className="w-full md:w-1/2 relative overflow-hidden shadow-xl">
          {/* Decorative Blobs */}
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="flex items-center justify-center p-6 mt-10">
            <EnhancedAuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
