import clsx from "clsx";
import "../styles/global.css"

interface Props{
    className?: string;
    children: any;
    styles? : React.CSSProperties
}

const GlassPane = ({ children, className,styles } : Props) => {
  return (
    <div
      className={clsx(
        "glass",
        className
      )}
      style={styles}
    >
      {children}
    </div>
  );
};

export default GlassPane;