"use client";
import Link from "next/link";
import { FiHome, FiCalendar, FiUser, FiSettings } from "react-icons/fi";
import "@/styles/global.css";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { subheaderFont } from "@/lib/fonts";

const icons = { FiHome, FiCalendar, FiUser, FiSettings };

interface Props {
  link: {
    label: string;
    icon: string;
    link: string;
  };
  open: boolean;
}

const SidebarLink = ({ link, open }: Props) => {
  const pathname = usePathname();
  let isActive = false;

  if (pathname === link.link) {
    isActive = true;
  }

  const Icon = icons[link.icon];
  return (
    <Link
      href={link.link}
      className={clsx(
        "tab-normal",
        isActive && "tab-active"
      )}
      style={{
        textDecoration: "none",
        height:"7%",
        width: "100%",
        paddingBlock: "0.5em",
        paddingInline: "1.9em",
        display:"flex",
        justifyContent: open ? "space-between" : "center",
        alignItems:"center"
      }}
    >
      <div>
        <Icon size={40} className={clsx(isActive && "tab-active")} />
      </div>
      <div className={clsx(open ? "show" : "hide", "sub-header-font", subheaderFont.className)} style={{margin:0,color:isActive ?"white":"" }}>{link.label}</div>
    </Link>
  );
};

export default SidebarLink;
