import Lottie from 'react-lottie';
import animationData from '../../assets/lottie/animation_llaz2kyr.json';

export default function NoResultFoundLottie() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
    
    return (
        <Lottie 
          options={defaultOptions}
          height={"100%"}
          width={"100%"}
        />
    );
  }