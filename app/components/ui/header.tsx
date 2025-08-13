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
  handleFacebookLogin: () => void;
};
export function Header({ categoryGroups, handleFacebookLogin }: Props) {
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
          <IoMdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
          <Input placeholder="Хайх..." className="pl-10" />
        </div>
        <h1
          className="text-center cursor-pointer hidden md:block bg-blue-400 rounded p-2 text-white font-bold"
          onClick={handleFacebookLogin}
        >
          Login with Facebook
        </h1>
        <MobileDrawer />
      </div>
      <div className="flex flex-wrap justify-center gap-4 border-b border-[#CCC9C9] py-2 volkhov-regular">
        <CategoryButton
          label="БҮТЭЭГДЭХҮҮН"
          value="PRODUCT"
          currentCollapsible={currentCollapsible}
          setCurrentCollapsible={setCurrentCollapsible}
          setIsOpen={setIsOpen}
        />
        <CategoryButton
          label="ҮЙЛЧИЛГЭЭ"
          value="SERVICE"
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

        {/* Mobile login button in category row */}
        {/* <h1
          className="text-center cursor-pointer md:hidden"
          onClick={handleFacebookLogin}
        >
          Login with Facebook
        </h1> */}
      </div>

      {/* Collapsible content */}
      <CategoryCollapsible
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        currentKey={currentCollapsible}
        data={categoryGroups}
      />
    </>
  );
}
