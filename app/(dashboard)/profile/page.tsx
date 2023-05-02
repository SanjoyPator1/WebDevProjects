import GlassPane from "@/components/GlassPane";
import ProfileForm from "@/components/ProfileForm/ProfileForm";
import { getUserFromCookie } from "@/lib/auth";
import { PRIMARY_DISTANCE, SECONDARY_DISTANCE } from "@/lib/constants";
import { pageTitleFont } from "@/lib/fonts";
import clsx from "clsx";
import { cookies } from 'next/headers';

const getData = async () => {
  const user = await getUserFromCookie(cookies());
  return user;
};

const ProfilePage = async () => {
  const user = await getData();

  return (
    <div className="column-flex-container" style={{ gap: PRIMARY_DISTANCE,height:"100%" }}>
      {/* Title JSX */}
      <div style={{ }}>
        <p className={clsx(pageTitleFont.className,"title-font")}>PROFILE</p>
      </div>
      <GlassPane className={clsx("primary-border-radius","column-flex-container","center-of-screen" )} styles={{padding:SECONDARY_DISTANCE,flex:1}}>
        <ProfileForm userData={user}/>
      </GlassPane>
    </div>
  );
};

export default ProfilePage;
