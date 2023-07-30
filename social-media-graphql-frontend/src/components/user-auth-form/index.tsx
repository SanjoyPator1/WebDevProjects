import React, { useCallback, useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Icons } from "../ui/icons";
import { useNavigate } from "react-router-dom";
import { uploadFileToCloudinary } from "../../lib/helperFunction";
import {useMutation } from "@apollo/client";
import { SIGNIN, SIGNUP } from "../../graphql/mutations/userMutations";
import { JWT_TOKEN_NAME } from "../../lib/constants";
import { AiOutlineDelete } from "react-icons/ai";
import { useToast } from "../ui/use-toast";
// import { ApolloError } from "@apollo/client";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  authType: "signin" | "signup";
}

interface FormValues {
  email: string;
  password: string;
  name?: string;
  avatar?: File;
}

const initialFormState: FormValues = {
  email: "",
  password: "",
  name: "",
  avatar: undefined,
};

export function UserAuthForm({
  className,
  authType,
  ...props
}: UserAuthFormProps) {
  const { toast } = useToast();
  const [formValues, setFormValues] = useState<FormValues>(initialFormState);
  const [signup, { loading: signupLoading }] =
    useMutation(SIGNUP);
  const [signin, { loading: signinLoading }] =
    useMutation(SIGNIN);

  const navigate = useNavigate();

  // Function to handle removing the avatar image
  const handleRemoveAvatar = useCallback(() => {
    setFormValues((prevState) => ({
      ...prevState,
      avatar: undefined,
    }));
    toast({
      variant: "default",
      title: "Selected Image removed",
      description: "Select a new image if you want to upload",
    });
  }, [setFormValues, toast]);

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      try {
        if (authType === "signup") {
          // Upload the avatar file to Cloudinary
          let uploadedImageUrl = null;
          if (formValues.avatar) {
            const cloudinaryResponse = await uploadFileToCloudinary(
              formValues.avatar
            );
            // The image url for the uploaded image
            uploadedImageUrl = await cloudinaryResponse?.url;
          }

          //mutation on signup done here
          const signUpFormData: FormValues = {
            name: formValues.name,
            email: formValues.email,
            password: formValues.password,
          };

          if (uploadedImageUrl) {
            signUpFormData.avatar = uploadedImageUrl;
          }

          const { data } = await signup({
            variables: {
              input: signUpFormData,
            },
          });
          // Save the userJwtToken to localStorage or a state management system (e.g., Redux)
          const userJwtToken = data.signup.userJwtToken;
          localStorage.setItem(JWT_TOKEN_NAME, userJwtToken);
          //show toast of successful signup
          toast({
            variant: "default",
            title: "Sign up successful",
            description: "Your account has been created successfully",
          });
        } else {
          const { data } = await signin({
            variables: {
              input: {
                email: formValues.email,
                password: formValues.password,
              },
            },
          });
          // Save the userJwtToken to localStorage or a state management system (e.g., Redux)
          const userJwtToken = data.signin.userJwtToken;
          localStorage.setItem(JWT_TOKEN_NAME, userJwtToken);
          toast({
            variant: "default",
            title: "Sign in successful",
            description: "You are successfully signed in",
          });
        }
        // After successful sign up or sign in, navigate to the appropriate route
        navigate("/");
      } catch (e: any) {
        const errorMessage =
          e?.networkError?.result?.errors?.[0]?.message ??
          "An unknown error occurred.";
        // console.log({ errorMessage });
        // console.log({signinError})
        toast({
          variant: "destructive",
          title: `Error in ${authType}`,
          description: errorMessage,
          
        });
      } finally {
        setFormValues({ ...initialFormState });
      }
    },
    [
      formValues.email,
      formValues.password,
      formValues.name,
      formValues.avatar,
      authType,
      navigate,
    ]
  );

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={formValues.email}
              placeholder="name@example.com"
              type="email"
              required={true}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={signupLoading || signinLoading}
              onChange={(e) => {
                setFormValues((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }));
              }}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              value={formValues.password}
              placeholder="password"
              type="password"
              required={true}
              autoCapitalize="none"
              autoCorrect="off"
              disabled={signupLoading || signinLoading}
              onChange={(e) => {
                setFormValues((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }));
              }}
            />
          </div>
          {authType === "signup" && (
            <>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="name">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formValues.name}
                  placeholder="Your Name"
                  required={true}
                  type="text"
                  autoCapitalize="words"
                  autoCorrect="off"
                  disabled={signupLoading}
                  onChange={(e) => {
                    setFormValues((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }));
                  }}
                />
              </div>
              {/* Display the image selector only when no image is selected */}
              {!formValues.avatar && (
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="avatar">
                    Avatar
                  </Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    disabled={signupLoading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFormValues((prevState) => ({
                        ...prevState,
                        avatar: file,
                      }));
                    }}
                  />
                </div>
              )}
              <div className="grid gap-1">
                {/* Display the selected avatar image */}
                {formValues.avatar && (
                  <div className="mt-2 flex flex-wrap justify-between items-center border  p-3 rounded-md hover:border-destructive">
                    <div className="flex flex-wrap items-center gap-2">
                      <img
                        className="w-20 h-20"
                        src={URL.createObjectURL(formValues.avatar)}
                        alt="Selected Avatar"
                      />
                      <p className="text-muted-foreground">
                        {formValues.avatar.name}
                      </p>
                    </div>
                    <AiOutlineDelete
                      className="ml-2 text-destructive text-2xl text-bold"
                      onClick={handleRemoveAvatar}
                    />
                  </div>
                )}
              </div>
            </>
          )}
          <Button disabled={signupLoading || signinLoading} type="submit">
            {signupLoading ||
              (signinLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ))}
            {authType === "signin"
              ? "Sign In with Email"
              : "Sign Up with Email"}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={signupLoading || signinLoading}
      >
        {signupLoading || signinLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
