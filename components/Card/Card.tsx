import clsx from "clsx";
import "../../styles/global.css"

interface Props{
    className?: string;
    children: any;
    styles? : React.CSSProperties
}

const Card = (props: Props) => {
  return (
    <div
      className={clsx(
        "card",
        props.className
      )}

      style={props.styles}
    >
      {props.children}
    </div>
  );
};

export default Card;