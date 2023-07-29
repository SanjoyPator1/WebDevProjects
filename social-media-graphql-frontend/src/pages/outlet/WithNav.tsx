import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { NavigationMenuBar } from "../../components/navbar";
import { JWT_TOKEN_NAME } from "../../lib/constants";
import { useQuery } from "@apollo/client";
import {
  GET_USER_BY_ID,
  LOGGEDIN_USER,
} from "../../graphql/queries/userQueries";
import { useRecoilState } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import { useToast } from "../../components/ui/use-toast";

const WithNav = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useRecoilState(userDataState);
  const token = localStorage.getItem(JWT_TOKEN_NAME);

  const { toast } = useToast();

  const { loading, data, error } = useQuery(LOGGEDIN_USER, {
    variables: { userId: localStorage.getItem(JWT_TOKEN_NAME) },
  });

  if (!token) {
    navigate("/signin");
    return;
  }

  useEffect(() => {
    // Update the Recoil atom with the logged-in user data if it exists
    if (data && data.me) {
      const userDataReceived = data.me;
      console.log({ userDataReceived });
      setUserData(data.me);
    }
  }, [data]);

  useEffect(()=> {
    if (error) {
      const e = error as any;
      const errorMessage =
        e?.networkError?.result?.errors?.[0]?.message ??
        "An unknown error occurred.";
      console.log({errorMessage})
      toast({
        variant: "destructive",
        title: `Authentication error`,
        description: errorMessage,
      });
      navigate("/signin");
    }
  },[error])

  return (
    <div className="h-full flex flex-col w-full overflow-hidden">
      <div className="w-full top-0 z-10">
        <NavigationMenuBar />
      </div>
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default WithNav;
