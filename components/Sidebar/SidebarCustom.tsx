import { useState } from "react";
import Logo from "Assets/logo-white.png";
import {FaBoxOpen, FaUserAlt, FaShoppingCart} from "react-icons/fa";
import { AiOutlineSetting } from "react-icons/ai";
import { MdDashboard, MdAreaChart, MdArrowBackIosNew } from "react-icons/md";
const ShopSidebar = () => {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Dashboard", icon: <MdDashboard />, link: "/shop/admin"},
    {
      title: "Orders",
      icon: <FaBoxOpen />,
      link: "/shop/orders"
    },
    { title: "Products", icon: <FaShoppingCart />},
    { title: "Customers", icon: <FaUserAlt /> },
    { title: "Marketing", icon: <MdAreaChart /> },
    { title: "Setting", icon: <AiOutlineSetting /> },
  ];
  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-72" : "w-20"
        } bg-[#2C3E50] h-screen p-5 pt-8 relative duration-300 shadow-xl rounded-t-xl mx-1`}
      >
        <div
        className={`absolute cursor-pointer -right-3 top-9 w-7 border-yellow-500 bg-yellow-400 py-2
            border-2 rounded-full flex justify-center ${!open && "rotate-180"}`}
        onClick={() => setOpen(!open)}
        >
            <MdArrowBackIosNew className="text-black text-center text-lg" />
        </div>
        <div className="flex gap-x-4 items-center">
          <img
            src={Logo}
            alt="Logo"
            className={`cursor-pointer duration-500 h-10 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Shop Admin
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-lg items-center gap-x-4 hover:text-yellow-600
              ${Menu.gap ? "mt-9" : "mt-2"} ${
                index === 0 && "bg-light-white"
              }`}
              onClick={() => window.location.href = Menu.link}
            >
              {Menu.icon}
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default ShopSidebar;