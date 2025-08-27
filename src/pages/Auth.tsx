import EnhancedAuthForm from "@/components/auth/EnhancedAuthForm";

const ChecklistItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-2 text-eloity-primary">
    <CheckIcon className="h-5 w-5 text-eloity-accent" />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-4 text-center">
          <h1 className="text-2xl font-bold text-eloity-primary">Eloity</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Where everything connects</p>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Side - Value Proposition */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-eloity-primary/10 to-eloity-accent/10">
            <div className="max-w-md mx-auto lg:max-w-none">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-eloity-primary mb-4 leading-tight">
                Welcome to Eloity
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Where everything connects - experience the unified ecosystem for social media, marketplace, crypto, and rewards.
              </p>

              <div className="space-y-6 mb-8">
                <ChecklistItem text="Connect with friends and create content" />
                <ChecklistItem text="Shop securely in our marketplace" />
                <ChecklistItem text="Learn crypto trading risk-free" />
                <ChecklistItem text="Earn rewards for everything you do" />
              </div>

              {/* Social Proof */}
              <div className="hidden md:block">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-400"></div>
                  </div>
                  <span>Join 10,000+ users building their future</span>
                </div>

                <img
                  src="/auth.webp"
                  alt="Eloity Platform Preview"
                  className="w-full h-auto rounded-lg shadow-lg object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full lg:w-1/2 relative bg-white dark:bg-gray-800">
            {/* Decorative Elements */}
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-eloity-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-eloity-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>

            <div className="relative z-10 flex items-center justify-center min-h-full p-6 sm:p-8 lg:p-12">
              <div className="w-full max-w-sm">
                <EnhancedAuthForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
