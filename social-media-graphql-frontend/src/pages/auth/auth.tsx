import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { UserAuthForm } from "../../components/user-auth-form";
import Logo from "../../components/logo";

interface AuthPageProps {
  authType: "signin" | "signup";
}

export const metadata = {
  title: "Authentication",
  description: "Authentication sign up and sign in social network",
};

const AuthPage: React.FC<AuthPageProps> = ({ authType }) => {
  const isSignIn = authType === "signin";
  const pageTitle = isSignIn ? "Sign In" : "Create an Account";
  const pageDescription = isSignIn
    ? "Enter your email and password to sign in"
    : "Enter your email below to create your account";

  return (
    <>
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          to={isSignIn ? "/signup" : "/signin"}
          className={cn("absolute right-4 top-4 md:right-8 md:top-8")}
        >
          {isSignIn ? "Sign Up" : "Sign In"}
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <Logo showText={true} />
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Social media connects us like never before, bridging distances and uniting hearts across the globe. Embrace the power of connection and be part of the vibrant community shaping our digital world.&rdquo;
              </p>
              <footer className="text-sm">The Code Blooded</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {pageTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                {pageDescription}
              </p>
            </div>
            <UserAuthForm authType={authType}/>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                to="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
