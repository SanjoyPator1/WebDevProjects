"use client";
import Link from "next/link";import "@/styles/global.css";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { IconType } from 'react-icons';
import { subheaderFont } from "@/lib/fonts";

interface Props {
  link: {
    label: string;
    icon : IconType;
    link: string;
  };
}

const SidebarLink = ({ link}: Props) => {
  const pathname = usePathname();
  let isActive = false;

  if (pathname === link.link) {
    isActive = true;
  }

  const Icon = link.icon;
  return (
    <Link
      href={link.link}
      className={clsx(
        "sidebar-link-container",
        "tab-normal",
        isActive && "tab-active"
      )}
    >
      <div>
        <Icon size={40} className={clsx(isActive && "tab-active")} />
      </div>
      <div className={clsx("sub-header-font", subheaderFont.className)} style={{margin:0,color:isActive ?"white":"" }}>{link.label}</div>
    </Link>
  );
};

export default SidebarLink;
