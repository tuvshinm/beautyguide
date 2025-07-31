import { Drawer, DrawerTrigger, DrawerContent } from "./drawer";
import { IoMdMenu } from "react-icons/io";
import { Button } from "./button";

export function MobileDrawer() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="ghost">
          <IoMdMenu className="h-8 w-8" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="right-0 left-auto w-[300px] h-screen rounded-none">
        <div className="p-4 flex flex-col gap-4">
          {/* You can add dynamic nav items here */}
          <span className="text-lg font-semibold">Menu</span>
          <a href="/products">Бүтээгдэхүүн</a>
          <a href="/services">Үйлчилгээ</a>
          <a href="/advice">Зөвлөгөө</a>
          <a href="/login">Нэвтрэх</a>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
