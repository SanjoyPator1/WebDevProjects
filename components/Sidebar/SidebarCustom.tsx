"use client"

import { useState } from "react";
import Logo from "@/public/vercel.svg";
import { FaBoxOpen, FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { AiOutlineSetting } from "react-icons/ai";
import { MdDashboard, MdAreaChart, MdArrowBackIosNew } from "react-icons/md";
import "./sidebar-style.css";

const ShopSidebar = () => {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Dashboard", icon: <MdDashboard />, link: "/shop/admin" },
    { title: "Orders", icon: <FaBoxOpen />, link: "/shop/orders" },
    { title: "Products", icon: <FaShoppingCart /> },
    { title: "Customers", icon: <FaUserAlt /> },
    { title: "Marketing", icon: <MdAreaChart /> },
    { title: "Setting", icon: <AiOutlineSetting /> },
  ];

  const handleMenuClick = (link) => {
    window.location.href = link;
  };

  return (
    <div className="shop-sidebar">
      <div
        className={`shop-sidebar__container ${open ? "w-72" : "w-20"}`}
      >
        <div
          className={`shop-sidebar__toggle ${!open ? "rotate" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <MdArrowBackIosNew className="shop-sidebar__toggle-icon" />
        </div>
        <div className="flex gap-x-4 items-center">
          <img
            src={Logo}
            alt="Logo"
            className={`shop-sidebar__logo ${
              open ? "rotate" : ""
            }`}
          />
          <h1
            className={`shop-sidebar__title ${
              !open ? "scale" : ""
            }`}
          >
            Shop Admin
          </h1>
        </div>
        <ul className="shop-sidebar__menu">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`shop-sidebar__menu-item ${
                Menu.gap ? "mt-9" : "mt-2"
              } ${index === 0 ? "bg-light-white" : ""}`}
              onClick={() => handleMenuClick(Menu.link)}
            >
              {Menu.icon}
              <span
                className={`shop-sidebar__menu-item-title ${
                  open ? "show" : "hide"
                }`}
              >
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
