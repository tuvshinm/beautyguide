import { Collapsible, CollapsibleContent } from "./collapsible";
import type { CollapsibleKey } from "../types";
import { CategoryGroup } from "@prisma/client";

type CategoryGroupWithCategories = CategoryGroup & {
  categories: {
    id: string;
    name: string;
  }[];
};

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentKey: CollapsibleKey;
  data: CategoryGroupWithCategories[];
};

export function CategoryCollapsible({
  isOpen,
  setIsOpen,
  currentKey,
  data,
}: Props) {
  // Optionally filter by currentKey if you want to show only relevant groups
  // or remove filtering to show all groups regardless of currentKey
  // For now, I'll assume you want all groups shown, but you can filter if needed:
  const filteredGroups = data.filter(
    (group) => group.affil.toLowerCase() === currentKey.toLowerCase()
  );

  return (
    <div>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={`flex w-screen flex-col gap-4 overflow-hidden transition-all duration-150 ease-in ${
          isOpen ? "opacity-100 p-1" : "opacity-0 p-0"
        } border-b-[1px] border-b-[#CCC9C9]`}
      >
        <CollapsibleContent className="flex flex-row gap-6 justify-evenly">
          {filteredGroups.map((group) => (
            <div key={group.id}>
              <div className="mb-4 volkhov-bold">{group.name}</div>
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                }}
              >
                {group.categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="rounded-md py-2 text-sm volkhov-regular"
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
