import type { FieldConfig } from "./EntityDrawerViewer";

export const categoryGroupDrawerFields: FieldConfig[] = [
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

export const categoryDrawerFields: FieldConfig[] = [
  { key: "name", label: "Category Name", type: "text" },
  {
    key: "categoryGroupId",
    label: "Category Group",
    type: "select",
    options: [],
  },
];
