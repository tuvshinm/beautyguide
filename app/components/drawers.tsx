import { Category, CategoryGroup } from "@prisma/client";
import type { FieldConfig } from "./EntityDrawerViewer";
export const categoryGroupDrawerFields: FieldConfig<CategoryGroup>[] = [
  { key: "name", label: "Group Name", type: "text" },
  {
    key: "affil",
    label: "affiliation",
    type: "select",
    options: [
      { value: "PRODUCT", label: "Product" },
      { value: "SERVICE", label: "Service" },
    ],
  },
];

export const categoryDrawerFields = (
  categoryGroups: CategoryGroup[]
): FieldConfig<Category>[] => {
  return [
    { key: "name", label: "Category Name", type: "text" },
    {
      key: "categoryGroupId",
      label: "Category Group",
      type: "select",
      // Dynamically create options from the categoryGroups data
      options: categoryGroups.map((group) => ({
        value: group.id,
        label: group.name,
      })),
    },
  ];
};
