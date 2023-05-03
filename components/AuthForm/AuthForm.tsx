"use client";
import { register, signin } from "@/lib/api";
import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "../Card/Card";
import { Button, TextField } from "@mui/material";
import "./authStyle.css"
import "@/styles/global.css"

interface formContentModel {
  linkUrl: string;
  linkLabel: string;
  linkText: string;
  header: string;
  subheader: string;
  buttonText: string;
}

interface formValuesModel {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const registerContent: formContentModel = {
  linkUrl: "/signin",
  linkLabel: "Already have an account?",
  linkText:"Sign In",
  header: "Create a new Account",
  subheader: "Just a few things to get started",
  buttonText: "Register",
};

const signinContent: formContentModel = {
  linkUrl: "/register",
  linkLabel: "Don't have an account?",
  linkText:"Register",
  header: "Welcome Back",
  subheader: "Enter your credentials to access your account",
  buttonText: "Sign In",
};

const initial: formValuesModel = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
};

const AuthForm = ({ mode }: { mode: "register" | "signin" }) => {
  const [formState, setFormState] = useState({ ...initial });
  const [error, setError] = useState({
    status : false,
    message: ""
  });

  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      try {
        if (mode === "register") {
          const res = await register(formState);
          if(res.status===401 || 400){
            setError({status:true, message: res.message})
          }
        } else {
          console.log("signin button pressed")
          const res = await signin(formState);
          if(res.status===401 || 400){
            setError({status:true, message: res.message})
          }
        }
        //after successful register - redirect to /home dashboard
        router.replace("/home");
      } catch (e) {
        setError({status:true,message: `Could not ${mode}`});
      } finally {
        setFormState({ ...initial });
      }
    },
    [
      formState.email,
      formState.password,
      formState.firstName,
      formState.lastName,
    ]
  );

  const content = mode === "register" ? registerContent : signinContent;

  const cardStyle: React.CSSProperties = {
    height:"85%",
    minWidth:"30%",
  };

  return (
    <Card styles={cardStyle}>
      <div className="column-flex-container" style={{padding:"1.5rem", gap:"2rem", height:"100%"}}>
        <div className="column-flex-container text-center" style={{gap:"0.2rem"}}>
          <h1 className="text-3xl mb-2">{content.header}</h1>
          <p className="tex-lg text-black/25">{content.subheader}</p>
        </div>
        <form onSubmit={handleSubmit} className="column-flex-container" style={{gap:"0.8rem", padding:0, flexGrow:"1"}}>
          {mode === "register" && (
            <>
              <div className="">
                <TextField 
                  variant="outlined"
                  size="small"
                  fullWidth
                  label="First Name"
                  required
                  value={formState.firstName}
                  className="border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full"
                  error = {error.status}
                  helperText= {error.message}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, firstName: e.target.value }))
                  } />
              </div>
              <div className="">
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                  label="Last Name"
                  value={formState.lastName}
                  error = {error.status}
                  helperText= {error.message}
                  className="border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full"
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, lastName: e.target.value }))
                  }
                />
              </div>
            </>
          )}

            <div className="">
              <TextField variant="outlined" size="small" fullWidth required type="email" id="email" label="Email"  value={formState.email}
              error = {error.status}
              helperText= {error.message}
              onChange={(e) =>
                  setFormState((s) => ({ ...s, email: e.target.value }))
                } />
            </div>
            <div className="">
              <TextField variant="outlined" size="small" fullWidth required type="password" id="password" label="Password" error = {error.status}
                  helperText= {error.message}  value={formState.password} onChange={(e) =>
                  setFormState((s) => ({ ...s, password: e.target.value }))
                } />
            </div>

            <div style={{marginTop:"2rem"}}>
                <Button fullWidth variant="contained" type="submit">
                  {content.buttonText}
                </Button>
            </div>
        </form>
        <div className="row-flex-container" style={{justifyContent:"space-between", alignItems:"center"}}>
                <div>
                  {content.linkLabel}
                </div>
                <Link
                    prefetch
                    href={content.linkUrl}
                  >
                    <Button variant="outlined">
                      {content.linkText}
                    </Button>
                </Link>
        </div>
      </div>
    </Card>
  );
};

export default AuthForm;
