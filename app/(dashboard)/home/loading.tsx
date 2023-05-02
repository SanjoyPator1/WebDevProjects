
import GlassPane from "@/components/GlassPane";
import ProjectCardSkeleton from "@/components/Skeleton/ProjectCardSkeleton";
import Skeleton from "@/components/Skeleton/Skeleton";
import { PRIMARY_DISTANCE, SECONDARY_DISTANCE } from "@/lib/constants";
import clsx from "clsx";
import "@/components/Skeleton/skeletonStyle.css"

export default function HomePageLoader() {

  const divCount = 6;
  
  // Create an array with divCount number of elements
  const divArray = Array.from({ length: divCount }, (_, index) => index);

  return (
    <div className="column-flex-container" style={{ gap: PRIMARY_DISTANCE }}>

    {/* Greetings JSX */}
    <div style={{height:"150px"}}>
      <Skeleton classNameProps="medium-container"/>
    </div>

    {/* All Projects Card */}
    <GlassPane className={clsx("primary-border-radius")} styles={{padding:SECONDARY_DISTANCE}}>
      <div className="column-flex-container" >
          <div style={{display:"flex",marginRight:SECONDARY_DISTANCE, justifyContent:"flex-end"}}>
            <div className="rectangle " style={{width:"155px"}}></div>
          </div>

          <div className="card-row-flex-container" style={{gap:PRIMARY_DISTANCE, justifyContent:"space-between", padding:SECONDARY_DISTANCE, maxHeight:"600px", overflow:"auto"}}>
          {divArray.map((index) => (
              <div className="card-container" key={index}><ProjectCardSkeleton/></div>
             ))}
          </div>

      </div>
    </GlassPane>


  </div>
  );
}