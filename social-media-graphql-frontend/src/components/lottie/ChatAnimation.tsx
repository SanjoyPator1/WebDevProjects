import Lottie from 'react-lottie';
import animationData from '../../assets/lottie/chatAnimation.json';

export default function ChatAnimation() {
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