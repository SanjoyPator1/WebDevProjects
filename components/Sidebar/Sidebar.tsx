import Card from "../Card/Card";
import Image from "next/image";
import logo from "../../public/logo.png"
import SidebarLink from "./SidebarLink";

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
  return (
    <Card className="column-flex-container sidebar-container">
      <div className="logo-container">
        <Image src={logo} alt="project logo" style={{width:"100%", height:"100%"}}/>
      </div>
      {links.map((link,index) => (
        <SidebarLink link={link} key={index}/>
      ))}
    </Card>
  );
};

export default Sidebar;
