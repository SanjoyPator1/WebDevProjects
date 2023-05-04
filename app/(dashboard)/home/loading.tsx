import GlassPane from "@/components/GlassPane";
import ProjectCardSkeleton from "@/components/Skeleton/ProjectCardSkeleton";
import Skeleton from "@/components/Skeleton/Skeleton";
import { PRIMARY_DISTANCE, SECONDARY_DISTANCE } from "@/lib/constants";
import clsx from "clsx";
import "@/components/Skeleton/skeletonStyle.css"
import "@/styles/global.css"

export default function HomePageLoader() {

  const divCount = 12;
  
  // Create an array with divCount number of elements
  const divArray = Array.from({ length: divCount }, (_, index) => index);

  return (
    <div className="column-flex-container" style={{ gap: "2%", height:"100%" }}>

    {/* Greetings JSX */}
    <div style={{height:"18%"}}>
      <Skeleton classNameProps="medium-container"/>
    </div>

    {/* All Projects Card */}
    <GlassPane className={clsx("primary-border-radius")} styles={{padding:SECONDARY_DISTANCE, height:"80%"}}>
      <div className="column-flex-container" style={{height:"100%"}}>
          <div style={{display:"flex",marginRight:SECONDARY_DISTANCE, justifyContent:"flex-end"}}>
            <div className="rectangle " style={{width:"155px"}}></div>
          </div>

          <div className="card-row-flex-container" style={{ flex:1, overflow:"auto"}}>
          {divArray.map((index) => (
              <div className="card-container" key={index}><ProjectCardSkeleton/></div>
             ))}
          </div>

      </div>
    </GlassPane>


  </div>
  );
}