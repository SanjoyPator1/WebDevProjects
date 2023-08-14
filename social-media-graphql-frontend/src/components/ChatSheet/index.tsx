import Chat from "../../pages/chat";
import {BsChatSquareDots } from "react-icons/bs";

import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export function ChatSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="h-full flex items-center">
          <BsChatSquareDots className={"h-6 w-6"}/>
        </div>
      </SheetTrigger>
      <SheetContent className="h-full flex flex-col gap-0">
        <Chat />
      </SheetContent>
    </Sheet>
  );
}
