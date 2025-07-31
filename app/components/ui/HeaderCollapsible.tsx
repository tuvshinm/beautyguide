import { Collapsible, CollapsibleContent } from "./collapsible";
import type { CollapsibleKey } from "../types";
import { CategoryGroup } from "@prisma/client";
type CategoryGroupWithCategories = CategoryGroup & {
  categories: {
    id: string;
    name: string;
    // other fields on Category if any
  }[];
};
type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentKey: CollapsibleKey; // or your CollapsibleKey type
  data: CategoryGroupWithCategories[];
};

export function CategoryCollapsible({
  isOpen,
  setIsOpen,
  currentKey,
  data,
}: Props) {
  // Find the group matching the current key (affil matches currentKey uppercased)
  const activeGroup = data.find(
    (group) => group.affil.toLowerCase() === currentKey.toLowerCase()
  );

  return (
    <div>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={`flex w-screen flex-col gap-2 overflow-hidden transition-all duration-150 ease-in ${
          isOpen ? "opacity-100 p-2" : "opacity-0 p-0"
        } border-b-[1px] border-b-[#CCC9C9]`}
      >
        <CollapsibleContent className="flex flex-col gap-2">
          {activeGroup?.categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-md border px-4 py-2 font-mono text-sm"
            >
              {cat.name}
            </div>
          )) || null}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
