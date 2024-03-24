import React, { ReactNode } from "react";
import NavBar from "../../components/navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex-grow px-10 py-5">{children}</div>
    </div>
  );
};

export default Layout;
