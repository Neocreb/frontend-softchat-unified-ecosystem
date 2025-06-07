
import { CardTitle, CardDescription } from "@/components/ui/card";
import SoftchatLogo from "../shared/SoftchatLogo";

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <>
      <div className="flex justify-center mb-2">
        <SoftchatLogo className="h-10 w-10" />
      </div>
      <CardTitle className="text-2xl">Welcome to Softchat</CardTitle>
      <CardDescription>
        {isLogin ? "Login to your account" : "Create a new account"}
      </CardDescription>
    </>
  );
};

export default AuthHeader;
