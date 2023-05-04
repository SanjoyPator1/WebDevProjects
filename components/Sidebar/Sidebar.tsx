"use client";
import Card from "../Card/Card";
import Image from "next/image";
import logo from "../../public/logo.png";
import SidebarLink from "./SidebarLink";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import "./style-sidebar.css";
import clsx from "clsx";

const links = [
  { label: "Home", icon: "FiHome", link: "/home" },
  {
    label: "Calendar",
    icon: "FiCalendar",
    link: "/calendar",
  },
  { label: "Profile", icon: "FiUser", link: "/profile" },
  {
    label: "Settings",
    icon: "FiSettings",
    link: "/settings",
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* arrow controller */}
      <div className="navbar">
        <div
          className={`sidebar__toggle ${open ? "rotate" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <GiHamburgerMenu className="sidebar__toggle-icon" />
        </div>
      </div>
      <Card
        className={`column-flex-container sidebar-container card-props ${
          !open && "hide-container"
        }`}
        styles={{ padding: 0 }}
      >
        <div
          className={clsx(open && "emptyContainer")}
          onClick={() => {
            setOpen(false);
          }}
        ></div>
        {/* logo and name */}
        <div className="flex gap-x-4 items-center">
          <div className="logo-container">
            <Image
              src={logo}
              alt="project logo"
              style={{ width: "100%", height: "100%", mixBlendMode: "darken" }}
              className={`${open ? "rotate" : ""}`}
            />
          </div>
        </div>
        {links.map((link, index) => (
          <SidebarLink link={link} key={index} open={open} />
        ))}
      </Card>
    </>
  );
};

export default Sidebar;
