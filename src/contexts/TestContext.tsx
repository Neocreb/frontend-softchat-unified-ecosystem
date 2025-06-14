import * as React from "react";

interface TestContextType {
  test: string;
  setTest: (test: string) => void;
}

const TestContext = React.createContext<TestContextType | undefined>(undefined);

export const useTest = () => {
  const context = React.useContext(TestContext);
  if (!context) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
};

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [test, setTest] = React.useState("test");

  const value = {
    test,
    setTest,
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};
