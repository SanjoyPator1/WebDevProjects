import Chat from "../../pages/chat";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export function ChatSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">Chat</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-left mb-2">Chat</SheetTitle>
          {/* <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription> */}
        </SheetHeader>
        <Chat />
      </SheetContent>
    </Sheet>
  );
}
