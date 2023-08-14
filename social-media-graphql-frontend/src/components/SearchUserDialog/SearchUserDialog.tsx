import { BsSearch } from "react-icons/bs";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { useLazyQuery } from "@apollo/client";
import { FC, useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import AvatarLogo from "../avatar/AvatarLogo";
import NoResultFoundLottie from "../lottie/NoResultFoundLottie";

interface SearchUserDialogProps {
  onUserClick: (user: any) => void; // Adjust the type according to your FriendModel
  query: any; // The GraphQL query
  queryVariables?: any; // The variables for the query
  textInputVariableName: string; // The variable name for the text input
}

const SearchUserDialog: FC<SearchUserDialogProps> = ({
  onUserClick,
  query,
  queryVariables,
  textInputVariableName,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");

  // Debounce the search input
  useEffect(() => {
    const delay = 500;
    const timeoutId = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Use useLazyQuery to execute the query when debouncedSearchInput changes
  const [searchUsers, { loading, error, data }] = useLazyQuery(query);

  useEffect(() => {
    if (debouncedSearchInput !== "") {
      searchUsers({
        variables: {
          ...queryVariables,
          [textInputVariableName]: debouncedSearchInput,
        },
      });
    }
  }, [
    debouncedSearchInput,
    searchUsers,
    queryVariables,
    textInputVariableName,
  ]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-0 w-full border-0 md:border-2" variant="outline">
          <div className="w-full flex flex-row items-center p-2 md:py-2 lg:px-4 lg:py-2 gap-md">
            <BsSearch className="h-4 w-4" />
            <div className="flex-1 h-fit p-1 border-0 hidden md:block cursor-pointer text-left font-normal">
              <p className="opacity-60">Search users...</p>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[85vh] flex flex-col gap-2 overflow-hidden">
        <div className="w-full flex flex-row items-center p-2 md:py-2 lg:px-4 lg:py-2 gap-md">
          <BsSearch className="h-4 w-4" />
          <Input
            type="text"
            placeholder="Search users..."
            className="flex-1 h-fit p-1 border-0 cursor-pointer text-left font-normal"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} // Update the search input state
          />
        </div>
        <Separator className="m-0" />
        {/* Display searched user result */}
        <ScrollArea className="flex-1">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {data && data.findUsersByName.length === 0 && (
            <div>
              <NoResultFoundLottie />
            </div>
          )}{" "}
          {data &&
            data.findUsersByName.map(
              (
                user: any // Adjust the type according to your FriendModel
              ) => (
                <DialogTrigger key={user._id} asChild className="mb-2 md:mb-3">
                  <div
                    onClick={() => {
                      onUserClick({
                        _id: user._id,
                        name: user.name,
                        avatar: user.avatar,
                      });
                    }}
                    className="flex flex-row items-center p-base-container gap-md"
                  >
                    <AvatarLogo
                      size="xs"
                      image={user.avatar!}
                      text={user.name}
                    />
                    <p>{user.name}</p>
                  </div>
                </DialogTrigger>
              )
            )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SearchUserDialog;
