import Chat from "../chat";
import Feed from "../feed";

const Home = () => {
  return (
    <div className="h-full flex flex-wrap">
      <div className="h-full border w-full md:w-9/12 p-lg-container">
        <Feed />
      </div>
      {/* Hidden on small screens (sm) and shown with width w-3/12 on medium screens (md) and above */}
      <div className="h-full hidden md:block border md:w-3/12 p-lg-container ">
        <Chat />
      </div>
    </div>
  );
};

export default Home;
