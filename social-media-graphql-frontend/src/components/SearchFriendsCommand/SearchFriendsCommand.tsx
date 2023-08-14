import React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import AvatarLogo from "../avatar/AvatarLogo";
import { FriendModel } from "../../models/component.model";
import { SetterOrUpdater } from "recoil";

interface SearchFriendsCommandProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  friends: FriendModel[];
  setSelectedChatUser : SetterOrUpdater<FriendModel | null>;
}


export function SearchFriendsCommand({
  open,
  setOpen,
  friends,
  setSelectedChatUser: setSelectedChatUserId
}: SearchFriendsCommandProps) {


  const friendSelectHandler = (_id: string, name: string, avatar:string) =>{
    setOpen(false)
    setSelectedChatUserId({
      _id,
      name,
      avatar
    })
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search Users..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {friends &&
            friends.length > 0 &&
            friends.map((friend) => (
              <CommandItem key={friend._id}>
                <div  onClick={()=>friendSelectHandler(friend._id, friend.name, friend.avatar!)} className="flex flex-row items-center p-base-container gap-md">
                  <AvatarLogo
                    size="xs"
                    image={friend.avatar!}
                    text={friend.name}
                  />
                  <p>{friend.name}</p>
                </div>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
