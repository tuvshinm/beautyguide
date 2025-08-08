import { useLoaderData } from "@remix-run/react";
import { DatasetOption, EntityDataTable } from "~/components/data-table";
import { db } from "~/utils/db.server";
import {
  categoryColumns,
  categoryGroupColumns,
  CategoryGroupWithCount,
} from "~/components/columns";
import { ActionFunctionArgs } from "@remix-run/node";
import {
  categoryDrawerFields,
  categoryGroupDrawerFields,
} from "~/components/drawers";
import { Category, CategoryGroup } from "@prisma/client";
export const loader = async () => {
  const categories = await db.category.findMany();
  const categoryGroups = await db.categoryGroup.findMany({
    include: {
      _count: {
        select: { categories: true },
      },
    },
  });
  return { categories, categoryGroups };
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const method = formData.get("_method");
  if (method === "delete") {
    const ids = formData.getAll("ids") as string[];
    if (ids.length > 0) {
      await db.category.deleteMany({
        where: { id: { in: ids } },
      });
      return { success: true };
    }
    throw new Response("No IDs provided", { status: 400 });
  }
  if (method === "create") {
    const newCategory = {
      name: formData.get("name") as string,
      categoryGroupId: formData.get("categoryGroupId") as string,
    };
    const response = await db.category.create({ data: newCategory });
    return response;
  }

  throw new Response("Method Not Allowed", { status: 405 });
};

export default function ProductCategories() {
  const { categories, categoryGroups } = useLoaderData<typeof loader>();

  const categoryDataset: DatasetOption<Category> = {
    key: "category",
    label: "Category",
    data: categories,
    columns: categoryColumns,
    drawerFields: categoryDrawerFields(categoryGroups),
    buttonLabel: "New Category",
    onCreate: handleCreate,
    onDelete: handleDelete,
  };

  const categoryGroupDataset: DatasetOption<CategoryGroupWithCount> = {
    key: "categoryGroup",
    label: "Category Group",
    data: categoryGroups,
    columns: categoryGroupColumns,
    drawerFields: categoryGroupDrawerFields,
    buttonLabel: "New Category Group",
    onCreate: handleCreateCategoryGroup,
    onDelete: handleDelete,
  };
  async function handleCreate(newCategory: Record<string, any>) {
    const formData = new FormData();
    Object.entries(newCategory).forEach(([key, value]) => {
      formData.append(key, value ?? "");
      formData.append("_method", "create");
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
      formData.append("_method", "create");
    });
    await fetch("/admin/products/categories/group", {
      method: "POST",
      body: formData,
    });
  }
  async function handleDelete(ids: string[]) {
    const formData = new FormData();
    ids.forEach((id) => {
      formData.append("ids", id);
    });
    formData.append("_method", "delete");
    await fetch("/admin/products/categories", {
      method: "POST",
      body: formData,
    });
  }

  return (
    <EntityDataTable
      datasets={[categoryDataset, categoryGroupDataset] as any}
    />
  );
}
