import { navBarModel } from "../models/component.model";

export const navBarWebsiteDummyData: navBarModel = {
    navBarData: [
      {
        name: "Feed",
        link: "/",
      },
      {
        name: "Sign Up",
        link: "/signup",
      },
      {
        name: "Sign In",
        link: "/signin",
      },
      {
        name: "Friends",
        link: "/friends",   //take the id from jwt token in local storage
      },
      {
        name: "Profile",
        link: "/profile:id",
      },
      {
        name: "Post",
        link: "/post:id",
      },
    ],
  };

export const JWT_TOKEN_NAME = "jwt-token-social-media";