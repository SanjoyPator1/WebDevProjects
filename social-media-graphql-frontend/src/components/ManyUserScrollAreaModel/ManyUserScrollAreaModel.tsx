import React, { FC } from "react";
import { ScrollArea } from "../ui/scroll-area";
import ProfileInfoCard from "../profileInfoCard/profileInfoCard";
import { ManyUserScrollAreaModel } from "../../models/component.model";

const ManyUserCard:FC<ManyUserScrollAreaModel> = ({dataProp}) => {
  return (
      <ScrollArea className="h-full relative">
        {dataProp.map((data, index) => (
          <div key={index} className="mb-4">
            <ProfileInfoCard
              avatar={data.avatar}
              name={data.name}
              friendStatus={data.friendStatus}
              bio={data.bio}
              isOwnProfile={data.isOwnProfile}
            />
          </div>
        ))}
      </ScrollArea>
  );
};

export default ManyUserCard;
