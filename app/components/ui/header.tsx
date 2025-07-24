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
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { CollapsibleKey } from "../types";
import { CategoryButton } from "./CategoryButton";
export function Header() {
  const [currentCollapsible, setCurrentCollapsible] =
    useState<CollapsibleKey>("none");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="border-t-[3vh] border-t-black p-3 flex justify-around items-center border-b-[1px] border-b-[#CCC9C9] gap-2">
        <div className="flex flex-col *:leading-tight volkhov-regular">
          <h1>BEAUTY</h1>
          <h1>GUIDE</h1>
        </div>
        <div className="relative w-full max-w-sm">
          <IoMdSearch className="absolute left-3 top-1/2 -translate-y-1/2  h-5 w-5" />
          <Input placeholder="Хайх..." className="pl-10" />
        </div>
        <div className="hidden md:flex flex-row gap-8 volkhov-regular">
          <CategoryButton
            label="БҮТЭЭГДЭХҮҮН"
            value="products"
            currentCollapsible={currentCollapsible}
            setCurrentCollapsible={setCurrentCollapsible}
            setIsOpen={setIsOpen}
          />
          <CategoryButton
            label="ҮЙЛЧИЛГЭЭ"
            value="services"
            currentCollapsible={currentCollapsible}
            setCurrentCollapsible={setCurrentCollapsible}
            setIsOpen={setIsOpen}
          />
          <CategoryButton
            label="ЗӨВЛӨГӨӨ"
            value="advice"
            currentCollapsible={currentCollapsible}
            setCurrentCollapsible={setCurrentCollapsible}
            setIsOpen={setIsOpen}
          />
          <h1>НЭВТРЭХ</h1>
        </div>
        {/*  This is stupid. This should be in a different component. */}
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
      {/* this is the collapsible section */}
      <div>
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className={`flex w-screen flex-col gap-2  overflow-hidden transition-all duration-150 ease-in ${
            isOpen ? "opacity-100 p-2" : "opacity-0 p-0"
          } border-b-[1px] border-b-[#CCC9C9]`}
        >
          <CollapsibleContent className="flex flex-col gap-2">
            {resources[currentCollapsible] || null}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
}
// to be replaced with a backend fetch.
const resources = {
  none: null,
  products: (
    <>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">
        Product 1
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">
        Product 2
      </div>
    </>
  ),
  services: (
    <>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">
        Service A
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">
        Service B
      </div>
    </>
  ),
  advice: (
    <>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">
        Advice Tip #1
      </div>
    </>
  ),
};
