import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 opacity-75 hover:opacity-100 transition-all">
        <Menu />
      </SheetTrigger>
      <SheetContent className="bg-white p-0" side={"left"}>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
