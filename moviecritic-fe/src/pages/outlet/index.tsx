import NavBar from "../../components/navbar";

const Outlet = () => {
  return (
    <>
      <NavBar />
      <div className="flex flex-wrap bg-secondary">
        <div className="min-h-full w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Outlet;
