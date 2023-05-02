import "./skeletonStyle.css"
import "@/styles/global.css"

const ProjectCardSkeleton = () => {
  return (
    <div className={"skeleton card secondary-border-radius"} style={{height:"100%"}}>
  	   <div className="skeleton-left" style={{display:"flex", flexFlow:"column wrap", justifyContent:"space-between", height:"80%"}}>
			<div>
			  <div className="line  w75"></div>
			  <div className="line h17 w40 m10"></div>
			</div>
			<div>
			  <div className="line h8 w50"></div>
			  <div className="line"></div>
			  <div className="line h8 w50" style={{justifySelf:"end", width:"50%"}}></div>
			</div>
	    </div>
  </div>
  )
}

export default ProjectCardSkeleton