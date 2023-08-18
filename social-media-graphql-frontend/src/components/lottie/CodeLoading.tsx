import Lottie from "react-lottie";
import animationData from "../../assets/lottie/codeLoading.json";

export default function CodeLoading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <div className="h-full w-full dark:hidden">
        <Lottie options={defaultOptions} height={"100%"} width={"100%"} />
      </div>
      <div className="h-full w-full hidden dark:block">
        <Lottie
          options={defaultOptions}
          height={"100%"}
          width={"100%"}
          style={{ filter: "invert(1" }}
        />
      </div>
    </>
  );
}
