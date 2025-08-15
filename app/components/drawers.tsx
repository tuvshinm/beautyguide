import { Blog, Category, CategoryGroup, Product } from "@prisma/client";
import { FieldConfig } from "./EntityDrawerViewer";

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
export const blogDrawerFields: FieldConfig<Blog>[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "body", label: "Body", type: "field" },
  { key: "photoUrl", label: "Photo URL", type: "image" },
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
      options: categoryGroups.map((group) => ({
        value: group.id,
        label: group.name,
      })),
    },
  ];
};

export const productDrawerFields = (
  categories: Category[]
): FieldConfig<Product>[] => {
  return [
    { key: "name", label: "Name", type: "text" },
    { key: "description", label: "Description", type: "text" },
    { key: "imageUrl", label: "Image", type: "image" },
    {
      key: "categoryId",
      label: "Category",
      type: "select",
      options: categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    },
  ];
};
