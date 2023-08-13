import Chat from "../../pages/chat";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";

export function ChatSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">Chat</Button>
      </SheetTrigger>
      <SheetContent className="h-full flex flex-col gap-0">
        <Chat />
      </SheetContent>
    </Sheet>
  );
}
