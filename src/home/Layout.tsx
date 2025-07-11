import React, { ReactNode, useEffect } from "react";
import HeaderSimple from "./HeaderSimple";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Scroll to top on initial render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderSimple />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
