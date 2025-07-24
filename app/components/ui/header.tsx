import { Input } from "./input";
import { IoMdSearch, IoMdMenu } from "react-icons/io";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { Button } from "./button";
export function Header() {
  return (
    <div className="border-t-[3vh] border-black p-3 flex justify-around items-center">
      <div className="flex flex-col *:leading-tight volkhov-regular">
        <h1>BEAUTY</h1>
        <h1>GUIDE</h1>
      </div>
      <div className="relative w-full max-w-sm">
        <IoMdSearch className="absolute left-3 top-1/2 -translate-y-1/2  h-5 w-5" />
        <Input placeholder="Хайх..." className="pl-10" />
      </div>
      <div className="flex flex-row gap-8">
        <h1>БҮТЭЭГДЭХҮҮНИЙ СЭТГЭГДЭЛ</h1>
        <h1>ҮЙЛЧИЛГЭЭНИЙ СЭТГЭГДЭЛ</h1>
        <h1>ЗӨВЛӨГӨӨ</h1>
        <h1>НЭВТРЭХ</h1>
      </div>
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="ghost">
            <IoMdMenu className="h-8 w-8" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="right-0 left-auto w-[300px] h-screen rounded-none">
          <div className="p-4 flex flex-col gap-4"></div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
