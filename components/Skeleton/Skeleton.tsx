import "./skeletonStyle.css";
import clsx from "clsx";

interface Props {
  type?: string;
  styleProps?:  React.CSSProperties;
  classNameProps?: string;
}

const Skeleton = ({ type, styleProps,classNameProps }: Props) => {
  return (
      <div className={clsx("skeleton","card","primary-border-radius",classNameProps)} style={{...styleProps,height:"100%"}}>
        <div className="skeleton-left">
          <div className="line h17 w40 m10"></div>
          <div className="line"></div>
          <div className="line h8 w50"></div>
          <div className="line  w75"></div>
        </div>
        <div className="skeleton-right">
          <div className="square circle"></div>
        </div>
      </div>
  );
};

export default Skeleton;
