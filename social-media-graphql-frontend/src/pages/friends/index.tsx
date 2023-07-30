import React from "react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { fakeProfileInfoData } from "../../lib/fakeData";
import ProfileInfoCard from "../../components/profileInfoCard/profileInfoCard";
import ManyUserCard from "../../components/ManyUserScrollAreaModel/ManyUserScrollAreaModel";

const Friends = () => {
  return (
    <ManyUserCard dataProp={fakeProfileInfoData} />
  );
};

export default Friends;
