import { useLoaderData } from "@remix-run/react";
import { EntityDataTable } from "~/components/data-table";
import { db } from "~/utils/db.server";
import { categoryColumns } from "~/components/columns";
import { ActionFunctionArgs } from "@remix-run/node";

export const loader = async () => {
  // Replace with your actual DB call
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

  return (
    <EntityDataTable
      data={categories}
      tabs={[{ value: "main", label: "Categories" }]}
      tabColumns={{
        main: categoryColumns,
      }}
      drawerFields={[
        { key: "name", label: "Name", type: "text" },
        {
          key: "categoryGroupId",
          label: "Category Group",
          type: "select",
          options: categoryGroups.map((group: any) => ({
            value: group.id,
            label: group.name,
          })),
        },
      ]}
      onCreate={handleCreate}
    />
  );
}
