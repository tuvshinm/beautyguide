import { useLoaderData } from "@remix-run/react";
import { EntityDataTableMulti } from "~/components/data-table";
import { db } from "~/utils/db.server";
import { categoryColumns, categoryGroupColumns } from "~/components/columns";
import { ActionFunctionArgs } from "@remix-run/node";
import {
  categoryDrawerFields,
  categoryGroupDrawerFields,
} from "~/components/drawers";
export const loader = async () => {
  const categories = await db.category.findMany();
  const categoryGroups = await db.categoryGroup.findMany();
  return { categories, categoryGroups };
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const newCategory = {
    name: formData.get("name") as string,
    categoryGroupId: formData.get("categoryGroupId") as string,
  };
  const response = await db.category.create({ data: newCategory });
  return response;
};

export default function ProductCategories() {
  const { categories, categoryGroups } = useLoaderData<typeof loader>();

  async function handleCreate(newCategory: Record<string, any>) {
    const formData = new FormData();
    Object.entries(newCategory).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    await fetch("/admin/products/categories", {
      method: "POST",
      body: formData,
    });
    // Optionally reload or revalidate here
  }

  async function handleCreateCategoryGroup(
    newCategoryGroup: Record<string, any>
  ) {
    const formData = new FormData();
    Object.entries(newCategoryGroup).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    await fetch("/admin/products/categories/group", {
      method: "POST",
      body: formData,
    });
    // Optionally reload or revalidate here
  }

  return (
    <EntityDataTableMulti
      datasets={[
        {
          key: "category",
          label: "Category",
          data: categories,
          columns: categoryColumns,
          drawerFields: categoryDrawerFields,
          buttonLabel: "New Category",
          onCreate: handleCreate,
        },
        {
          key: "categoryGroup",
          label: "Category Group",
          data: categoryGroups.map((group: any) => ({
            ...group,
            categoryGroupId: group.id,
          })),
          columns: categoryGroupColumns,
          drawerFields: categoryGroupDrawerFields,
          buttonLabel: "New Category Group",
          onCreate: handleCreateCategoryGroup,
        },
      ]}
    />
  );
}
