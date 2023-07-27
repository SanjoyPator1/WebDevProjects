import React, { useCallback, useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Icons } from "../ui/icons";
import { useNavigate } from "react-router-dom";
import { uploadFileToCloudinary } from "../../lib/helperFunction";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>(initialFormState);

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      try {
        if (authType === "signup") {
          // Upload the avatar file to Cloudinary
          let uploadedImageUrl = null;
          if (formValues.avatar) {
            uploadedImageUrl = await uploadFileToCloudinary(formValues.avatar);
            // The image url for the uploaded image
            console.log("uploaded Image Url:", uploadedImageUrl);
          }

          // Now you can proceed with the signup mutation using formValues
          console.log("Sign up with values:", formValues);
        } else {
          console.log("Sign in with values:", formValues);
        }
        // After successful sign up or sign in, navigate to the appropriate route
        navigate("/");
      } catch (e) {
        console.error(`Could not ${authType} for ${e}`);
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
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
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
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
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
                  type="text"
                  autoCapitalize="words"
                  autoCorrect="off"
                  disabled={isLoading}
                  onChange={(e) => {
                    setFormValues((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="avatar">
                  Avatar
                </Label>
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  disabled={isLoading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setFormValues((prevState) => ({
                      ...prevState,
                      avatar: file,
                    }));
                  }}
                />
              </div>
            </>
          )}
          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
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
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
