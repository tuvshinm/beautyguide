import { Input } from "./input";
import { IoMdSearch } from "react-icons/io";
import { useState } from "react";
import { CollapsibleKey } from "../types";
import { CategoryButton } from "./CategoryButton";
import { CategoryCollapsible } from "./HeaderCollapsible";
import { MobileDrawer } from "./MobileDrawer";
import { CategoryGroup } from "@prisma/client";
type CategoryGroupWithCategories = CategoryGroup & {
  categories: {
    id: string;
    name: string;
  }[];
};
type Props = {
  categoryGroups: CategoryGroupWithCategories[];
};
export function Header({ categoryGroups }: Props) {
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
        <MobileDrawer />
      </div>
      <CategoryCollapsible
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        currentKey={currentCollapsible}
        data={categoryGroups}
      />
    </>
  );
}
