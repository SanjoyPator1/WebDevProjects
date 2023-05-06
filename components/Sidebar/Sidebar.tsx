"use client";
import Card from "../Card/Card";
import Image from "next/image";
import logo from "../../public/logo.png";
import SidebarLink from "./SidebarLink";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";
import "./style-sidebar.css";
import clsx from "clsx";
import { Button } from "@mui/material";
import { DARK_COLOR } from "@/lib/constants";

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

  const handleSignOut = () => {
    console.log("logout");
  };

  return (
    <>
      {/* arrow controller */}
      <div
        className={clsx(
          "navbar",
          open ? "navbar-open-width" : "navbar-close-width"
        )}
      >
        <div
          className={`sidebar__toggle ${open ? "open" : "close"}`}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <GrClose
              className="sidebar__toggle-icon"
              style={{ backgroundColor: "transparent", color: "red" }}
            />
          ) : (
            <GiHamburgerMenu className="sidebar__toggle-icon" />
          )}
        </div>
      </div>
      <Card
        className={`column-flex-container sidebar-container card-props ${
          !open && "hide-container"
        }`}
        styles={{ padding: 0 }}
      >
        <div
          className={clsx("emptyContainer", open ? "open" : "close")}
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
          <SidebarLink link={link} key={index} />
        ))}
        <div className="sign-out-button">
          <Button
            fullWidth
            style={{
              borderRadius: 0,
              backgroundColor: DARK_COLOR,
              color: "white",
              paddingBlock:"1.5em",
            }}
            onClick={() => handleSignOut}
          >
            Sign out
          </Button>
        </div>
      </Card>
    </>
  );
};

export default Sidebar;
