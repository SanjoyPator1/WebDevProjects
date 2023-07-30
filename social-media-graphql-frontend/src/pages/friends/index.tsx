
import { fakeProfileInfoData } from "../../lib/fakeData";
import ManyUserCard from "../../components/ManyUserScrollAreaModel/ManyUserScrollAreaModel";

const Friends = () => {
  return (
    <ManyUserCard dataProp={fakeProfileInfoData} />
  );
};

export default Friends;
