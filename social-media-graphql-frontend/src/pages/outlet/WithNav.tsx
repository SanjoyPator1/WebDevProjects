import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { NavigationMenuBar } from "../../components/navbar";
import { JWT_TOKEN_NAME } from "../../lib/constants";
import { useQuery } from "@apollo/client";
import {
  LOGGEDIN_USER as LOGGED_IN_USER,
} from "../../graphql/queries/userQueries";
import {  useSetRecoilState } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import { useToast } from "../../components/ui/use-toast";
import Chat from "../chat";

const WithNav = () => {
  const navigate = useNavigate();
  const setUserData = useSetRecoilState(userDataState);
  const token = localStorage.getItem(JWT_TOKEN_NAME);

  const { toast } = useToast();

  const { data, error } = useQuery(LOGGED_IN_USER, {
    variables: { userId: localStorage.getItem(JWT_TOKEN_NAME) },
  });

  if (!token) {
    navigate("/signin");
    return;
  }

  useEffect(() => {
    // Update the Recoil atom with the logged-in user data if it exists
    console.log("inside useEffect to update recoil state")
    if (data && data.me) {
      const userDataReceived = data.me;
      console.log({ userDataReceived });
      setUserData(data.me);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const e = error as any;
      const errorMessage =
        e?.networkError?.result?.errors?.[0]?.message ??
        "An unknown error occurred.";
      console.log({ errorMessage });
      toast({
        variant: "destructive",
        title: `Authentication error`,
        description: errorMessage,
      });
      navigate("/signin");
    }
  }, [error]);

  return (
    <div className="h-full flex flex-col w-full overflow-hidden">
      <div className="w-full top-0 z-20">
        <NavigationMenuBar />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-wrap">
          <div className="h-full border-r-2 w-full md:w-9/12 p-lg-container md:p-2xl-container">
            <Outlet />
          </div>
          <div className="h-full hidden md:block md:w-3/12 p-lg-container">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithNav;
