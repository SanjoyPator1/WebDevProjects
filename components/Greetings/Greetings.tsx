import { getUserFromCookie } from "@/lib/auth";
import { cookies } from "next/headers";
import Card from "../Card/Card";
import { PRIMARY_DISTANCE } from "@/lib/constants";
import clsx from "clsx";
import { bodyFont, subheaderFont, greetingsFont } from "@/lib/fonts";

const getData = async () => {
  const user = await getUserFromCookie(cookies());
  return user;
};

interface Props{
  classNameProps?: string;
}

const Greetings =async ({classNameProps}: Props ) => {
    const user = await getData();
    return (
            <Card className={clsx("column-flex-container",classNameProps)} styles={{ padding:PRIMARY_DISTANCE, height:"100%"}}>
              <div className="column-flex-container" style={{height:"100%", justifyContent:"space-around"}}>
                <h1 className={clsx(greetingsFont.className,"title-font")}>
                  Hello, {user?.first_name}!
                </h1>
                <h4 className={clsx(bodyFont.className,"body-font")}>
                  Check your daily tasks and schedule
                </h4>
              </div>
              <div>
               
              </div>
            </Card>
          );
}

export default Greetings