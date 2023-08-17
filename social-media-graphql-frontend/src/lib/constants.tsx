import { DialogFormModelData, navBarModel } from "../models/component.model";

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

export const profileFormModelData: DialogFormModelData = {
  buttonName: "Edit Profile",
  dialogTitle:"Edit your profile ",
  dialogDescription:"Make changes to your profile here. Click save when you're done.",
  formFieldsModelData: [
    { label: "Name", inputType: "text", inputId: "name", isRequired: true },
    { label: "Email", inputType: "email", inputId: "email" , isRequired: true},
    { label: "Avatar", inputType: "text", inputId: "avatar" , isRequired: true},
    { label: "Bio", inputType: "text", inputId: "bio" , isRequired: true},
  ],
  initialValues: {
    name: "", // Provide initial value for Name
    email: "", // Provide initial value for Email
    avatar: "", // Provide initial value for Avatar
    bio: "", // Provide initial value for Bio
  },
};


