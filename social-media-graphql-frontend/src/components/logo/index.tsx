import BrandLogo from "../BrandLogo";
import logo from "../../assets/desktopLogo.svg"

interface LogoProps {
  showIcon?: boolean;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ showIcon = true, showText }) => {
  return (
    <div className="relative z-20 flex items-center text-lg font-medium gap-md">
      {showIcon && (
        <img className="h-12" src={logo} alt="desktop logo" />
      )}
      {showText && (
        <span>
          <BrandLogo type="light"/>
        </span>
      )}
    </div>
  );
};

export default Logo;
