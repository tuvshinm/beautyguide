import { useFetcher, useLoaderData } from "@remix-run/react";
import { EntityDataTable } from "~/components/data-table";
import { db } from "~/utils/db.server";
import type { DatasetOption } from "~/components/types";
import {
  AffiliationLabels,
  categoryColumns,
  categoryGroupColumns,
  CategoryGroupWithCount,
} from "~/components/columns";
import { ActionFunctionArgs } from "@remix-run/node";
import {
  categoryDrawerFields,
  categoryGroupDrawerFields,
} from "~/components/drawers";
import { Affiliation, Category } from "@prisma/client";
export const loader = async () => {
  const categories = await db.category.findMany({
    include: {
      categoryGroup: {
        select: { id: true, name: true },
      },
      _count: { select: { products: true } },
    },
  });

  const categoryGroups = await db.categoryGroup.findMany({
    include: {
      _count: { select: { categories: true } },
    },
  });
  return { categories, categoryGroups };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const method = formData.get("method");
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
  if (method === "categoryGroup") {
    const newCategoryGroup = {
      name: formData.get("name") as string,
      affil: formData.get("affil") as Affiliation,
    };
    console.log(newCategoryGroup);
    const response = await db.categoryGroup.create({ data: newCategoryGroup });
    return response;
  }
  if (method === "update") {
    const updatedItems = JSON.parse(formData.get("updatedItems") as string);
    for (const item of updatedItems) {
      await db.category.update({
        where: { id: item.id },
        data: item,
      });
    }
    return null;
  } else if (method === "categoryGroupUpdate") {
    const updatedItems = JSON.parse(formData.get("updatedItems") as string);
    for (const item of updatedItems) {
      await db.categoryGroup.update({
        where: { id: item.id },
        data: item,
      });
    }
    return null;
  } else if (method === "categoryGroupDelete") {
    const ids = formData.getAll("ids") as string[];
    if (ids.length > 0) {
      await db.categoryGroup.deleteMany({
        where: { id: { in: ids } },
      });
      return { success: true };
    }
    throw new Response("No IDs provided", { status: 400 });
  }
  throw new Response("Method Not Allowed", { status: 405 });
};

export default function ProductCategories() {
  const { categories, categoryGroups } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const categoryDataset: DatasetOption<Category> = {
    key: "category",
    label: "Category",
    data: categories,
    columns: categoryColumns(categoryGroups), // Pass categoryGroups here
    drawerFields: categoryDrawerFields(categoryGroups),
    buttonLabel: "New Category",
    onCreate: handleCreate,
    onDelete: handleDelete,
    onUpdate: handleUpdate,
    dropdownOptions: {
      categoryGroupId: categoryGroups.map((g) => ({
        value: g.id,
        label: g.name,
      })),
    },
  };

  const categoryGroupDataset: DatasetOption<CategoryGroupWithCount> = {
    key: "categoryGroup",
    label: "Category Group",
    data: categoryGroups,
    columns: categoryGroupColumns,
    drawerFields: categoryGroupDrawerFields,
    buttonLabel: "New Category Group",
    onCreate: handleCreateCategoryGroup,
    onDelete: handleCategoryGroupDelete,
    onUpdate: handleCategoryGroupUpdate,
    dropdownOptions: {
      Affiliation: Object.entries(AffiliationLabels).map(([value, label]) => ({
        value,
        label,
      })),
    },
  };
  async function handleCreate(formData: FormData) {
    formData.append("method", "create");
    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  }
  async function handleCreateCategoryGroup(formData: FormData) {
    formData.append("method", "categoryGroup");
    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  }
  async function handleDelete(ids: string[]) {
    const formData = new FormData();
    ids.forEach((id) => {
      formData.append("ids", id);
    });
    formData.append("method", "delete");
    fetcher.submit(formData, { method: "post" });
  }
  async function handleUpdate(updatedItems: any[]) {
    const formData = new FormData();
    formData.append("method", "update");
    formData.append("updatedItems", JSON.stringify(updatedItems));
    console.log(formData);
    fetcher.submit(formData, { method: "post" });
  }
  async function handleCategoryGroupUpdate(updatedItems: any[]) {
    const formData = new FormData();
    formData.append("method", "categoryGroupUpdate");
    formData.append("updatedItems", JSON.stringify(updatedItems));
    console.log(formData);
    fetcher.submit(formData, { method: "post" });
  }
  async function handleCategoryGroupDelete(ids: string[]) {
    const formData = new FormData();
    ids.forEach((id) => {
      formData.append("ids", id);
    });
    formData.append("method", "categoryGroupDelete");
    fetcher.submit(formData, { method: "post" });
  }
  return (
    <EntityDataTable
      datasets={[categoryDataset, categoryGroupDataset] as any}
    />
  );
}
