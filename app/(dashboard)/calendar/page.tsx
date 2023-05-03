import GlassPane from "@/components/GlassPane";
import { PRIMARY_DISTANCE, SECONDARY_DISTANCE } from "@/lib/constants";
import { pageTitleFont } from "@/lib/fonts";
import clsx from "clsx";
import workingImage from "@/public/working-page.png"
import Image from 'next/image';

const CalendarPage = () => {
  return (
    <div className="column-flex-container" style={{ gap: PRIMARY_DISTANCE,height:"100%" }}>
      {/* Title JSX */}
      <div style={{height:"7%" }}>
        <p className={clsx(pageTitleFont.className,"title-font")}>CALENDAR</p>
      </div>
      <GlassPane className={clsx("primary-border-radius")} styles={{padding:SECONDARY_DISTANCE, height:"88%", width:"100%", overflow:"hidden"}}>
        <Image src={workingImage} alt="working on this page" style={{maxHeight:"100%", maxWidth:"100%", objectFit:"cover"}}/>
      </GlassPane>
    </div>
  )
}

export default CalendarPage;



