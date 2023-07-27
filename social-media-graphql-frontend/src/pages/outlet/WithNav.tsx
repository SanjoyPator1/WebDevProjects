import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { NavigationMenuBar } from "../../components/navbar";
import { JWT_TOKEN_NAME } from "../../lib/constants";

const WithNav = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(JWT_TOKEN_NAME);
    if (!token) {
      navigate("/signin");
    }
  }, []);

  return (
    <div className="h-screen w-full overflow-x-hidden">
      <div className="fixed w-full top-0 z-10">
        <NavigationMenuBar />
      </div>
      <div className="h-full pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default WithNav;
