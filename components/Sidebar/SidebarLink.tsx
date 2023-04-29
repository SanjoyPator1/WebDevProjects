"use client";
import Link from "next/link";
import { FiHome,FiCalendar,FiUser,FiSettings } from 'react-icons/fi';
import "@/styles/global.css"
import { usePathname } from "next/navigation";
import clsx from "clsx";

const icons = {  FiHome,FiCalendar,FiUser,FiSettings };

interface Props {
    link : {
        label: string;
        icon: string;
        link: string;
    }
}

const SidebarLink = ({ link } : Props) => {
  const pathname = usePathname();
  let isActive = false;

  if (pathname === link.link) {
    isActive = true;
  }

  const Icon = icons[link.icon];
  return (
    <Link href={link.link} className="w-full flex justify-center items-center">
      <Icon
        size={40}
        className={clsx(
          "tab-normal",
          isActive && "tab-active"
        )}
      />
    </Link>
  );
};

export default SidebarLink;