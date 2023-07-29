import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { cn } from "../../lib/utils";
import { useRecoilValue } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import ThemeSelector from "../ThemeSelector";
import { ChatSheet } from "../ChatSheet";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export function NavigationMenuBar() {
  const userData = useRecoilValue(userDataState);

  return (
    <NavigationMenu className="border">
      <NavigationMenuList className="w-screen flex flex-row justify-between gap-x-2 md:gap-x-3">
        {/* normal link */}
        <div className="">
          {/* logo */}
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Logo
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </div>
        <div className="flex flex-row flex-wrap justify-end gap-x-2 md:gap-x-3">
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to={`/friends/${userData._id}`}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Friends
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="px-4 py-2">
            <ThemeSelector/>
          </NavigationMenuItem>
          <NavigationMenuItem className="block md:hidden">
            <ChatSheet />
          </NavigationMenuItem>
          {/* drop down menu */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
            <NavigationMenuContent >
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
                <ListItem linkTo={`/friends/${userData._id}`} title="Friends">
                  See all your friends
                </ListItem>
                <ListItem linkTo={`/settings/${userData._id}`} title="Settings">
                  Change settings here
                </ListItem>
                <ListItem linkTo={"/signin"} title="Log out">
                  Log out of your account{" "}
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </div>
        {/* <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface ListItemProps  {
  className?: string;
  title: string;
  linkTo: string;
  children: ReactNode;
};

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
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
