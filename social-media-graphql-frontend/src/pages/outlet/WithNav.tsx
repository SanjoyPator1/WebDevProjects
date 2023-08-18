import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { NavigationMenuBar } from "../../components/navbar";
import { JWT_TOKEN_NAME } from "../../lib/constants";
import { useQuery } from "@apollo/client";
import {
  LOGGEDIN_USER ,
} from "../../graphql/queries/userQueries";
import {  useRecoilValue, useSetRecoilState } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import { useToast } from "../../components/ui/use-toast";
import Chat from "../chat";

const WithNav = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userDataState)
  const setUserData = useSetRecoilState(userDataState);
  const token = localStorage.getItem(JWT_TOKEN_NAME);

  const { toast } = useToast();

  const { data, error } = useQuery(LOGGEDIN_USER, {fetchPolicy: user._id ? "cache-only" : "no-cache"});

  if (!token) {
    navigate("/signin");
    return;
  }

  useEffect(() => {
    // Update the Recoil atom with the logged-in user data if it exists
    if (data && data.me) {
      const userDataReceived = data.me;
      setUserData(userDataReceived);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const e = error as any;
      const errorMessage =
        e?.networkError?.result?.errors?.[0]?.message ??
        "An unknown error occurred.";
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
          <div className="h-full border-r-2 w-full md:w-8/12 p-lg-container md:px-2xl">
            <Outlet />
          </div>
          <div className="h-full hidden md:block md:w-4/12 p-base-container md:p-md-container">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithNav;
