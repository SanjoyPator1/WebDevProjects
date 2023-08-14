import React, { ReactNode } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { cn } from "../../lib/utils";
import { useRecoilValue } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import ThemeSelector from "../ThemeSelector";
import { ChatSheet } from "../ChatSheet";
import BrandLogo from "../BrandLogo";
import NotificationsDropdown from "../../pages/notifications/Notifications";
import { BiSolidHome,BiHome } from "react-icons/bi";
import { BsFillPeopleFill, BsPeople } from "react-icons/bs";
import { RiAccountPinCircleFill, RiAccountPinCircleLine } from "react-icons/ri";
import { Link, useMatch } from "react-router-dom";

export function NavigationMenuBar() {
  const userData = useRecoilValue(userDataState);

  return (
    <NavigationMenu className="border-b-2 h-16">
      <NavigationMenuList className="w-screen flex flex-row justify-between gap-x-1 md:gap-x-2 lg:gap-x-3">
        {/* normal link */}
        <div className="p-2 lg:px-4 lg:py-2">
          {/* logo */}
          <NavigationMenuItem className="flex items-center">
            <NavigationMenuLink>
              <BrandLogo />
            </NavigationMenuLink>
          </NavigationMenuItem>
        </div>
        <div className="flex flex-row flex-wrap justify-end gap-x-2 md:gap-x-3 lg:gap-x-4 pr-2">
          <NavigationMenuItem className="px-1 py-2 lg:px-4 lg:py-2 flex items-center">
            <Link to="/">
              <NavigationMenuLink>
              {useMatch("/") ? <BiSolidHome className="md:hidden h-6 w-6" /> : <BiHome className="md:hidden h-6 w-6" />}
                <p className="hidden md:block">Home</p>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="px-1 py-2 lg:px-4 lg:py-2 flex items-center">
            <Link to={`/friends`}>
              <NavigationMenuLink >
              {useMatch("/friends") ? <BsFillPeopleFill className="md:hidden h-6 w-6" /> : <BsPeople className="md:hidden h-6 w-6" />}
                <p className="hidden md:block">Friends</p>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="px-1 py-2 lg:px-4 md:py-2 hidden lg:flex items-center">
            <ThemeSelector />
          </NavigationMenuItem>
          <NavigationMenuItem className="block md:hidden px-1 py-2 lg:px-4 lg:py-2">
            <ChatSheet />
          </NavigationMenuItem>
          {/* drop down menu for profile*/}
          <NavigationMenuItem className="px-1 py-2 lg:px-4 lg:py-2 flex items-center">
            <NavigationMenuTrigger className="p-0">
            {useMatch("/profile") ? <RiAccountPinCircleFill className="md:hidden h-6 w-6" /> : <RiAccountPinCircleLine className="md:hidden h-6 w-6" />}
              <p className="hidden md:block">Profile</p>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link to={`/profile/${userData._id}`}>
                      <div
                        className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none focus:shadow-md bg-cover bg-no-repeat relative"
                        style={{ backgroundImage: `url(${userData.avatar})` }}
                      >
                        {/* Semi-transparent dark overlay */}
                        <div className="absolute inset-0 bg-black opacity-50 rounded-md"></div>

                        <div
                          className={`mb-md md:mb-lg mt-4 w-10 h-10 md:w-30 md:h-30 text-lg font-medium text-white relative z-10`}
                        >
                          {userData.name}
                        </div>

                        <p className="text-sm leading-tight text-white relative z-10">
                          See your profile
                        </p>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem linkTo={`/friends`} title="Friends">
                  See all your friends
                </ListItem>
                <ListItem linkTo={`/settings/${userData._id}`} title="Settings">
                  Change settings here
                </ListItem>
                <div className="p-1 md:px-4 md:py-2 lg:hidden">
                  <div className="text-sm font-medium leading-none">
                    Theme selector
                  </div>
                  <div className="flex items-center justify-between gap-2 py-2">
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Light/Dark
                    </p>
                    <ThemeSelector />
                  </div>
                </div>
                {/* reload , delete local storage jwt token */}
                <ListItem linkTo={"/signin"} title="Log out">
                  Log out of your account{" "}
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* drop down menu for notification TODO: make a separate component Notifications*/}
          <NavigationMenuItem className="px-1 py-2 lg:px-4 lg:py-2 flex items-center">
            <NotificationsDropdown />
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface ListItemProps {
  className?: string;
  title: string;
  linkTo: string;
  children: ReactNode;
}

const ListItem: React.FC<ListItemProps> = ({
  className,
  title,
  linkTo,
  children,
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link to={linkTo}>
          <div
            className={cn(
              "block select-none space-y-1 rounded-md md:p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default ListItem;
ListItem.displayName = "ListItem";
