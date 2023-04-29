import { cva, VariantProps } from "class-variance-authority";
import { FC } from "react";
import "../styles/global.css"
import clsx from "clsx";

export interface ButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<any> {}

const Button: FC<ButtonProps> = ({
  children,
  className,
}) => {
  return (
    <button className={clsx("",className)}>
      {children}
    </button>
  );
};

export default Button;