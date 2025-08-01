import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { EntityDataTable } from "~/components/data-table";
import { db } from "~/utils/db.server";
import { productColumns } from "~/components/columns";
import { useState } from "react";
export async function loader() {
  const products = await db.product.findMany({
    skip: 0,
    take: 10,
  });
  const categorys = await db.category.findMany({});
  const categoryGroups = await db.categoryGroup.findMany({});
  return Response.json({
    products,
    categorys,
    categoryGroups,
  });
}
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const newProduct = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    imageUrl: formData.get("imageUrl") as string,
    categoryId: formData.get("categoryId") as string,
  };
  const response = await db.product.create({ data: newProduct });
  return Response.json(response);
}

export const meta: MetaFunction = () => {
  return [{ title: "Products" }, { name: "description", content: "Beauty!" }];
};
export default function ProductIndex() {
  const { products, categorys, categoryGroups } =
    useLoaderData<typeof loader>();
  const [pending, setPending] = useState(false);
  async function handleCreate(newProduct: Record<string, any>) {
    setPending(true);
    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    await fetch("/admin/products", {
      method: "POST",
      body: formData,
    });
    setPending(false);
    // Optionally, reload products here or use Remix's revalidation
    // location.reload();
  }
  return (
    <div>
      <EntityDataTable
        data={products}
        tabs={[
          { value: "outline", label: "Outline" },
          { value: "details", label: "Details" },
        ]}
        tabColumns={{
          outline: productColumns,
          details: productColumns, // or another columns set
        }}
        drawerFields={[
          { key: "name", label: "Name", type: "text" },
          { key: "description", label: "Description", type: "text" },
          { key: "imageUrl", label: "Image", type: "image" },
          {
            key: "categoryId",
            label: "Category",
            type: "select",
            options: categorys.map((cat: any) => ({
              value: cat.id,
              label: cat.name,
            })),
          },
        ]}
        onCreate={handleCreate}
      />
      {pending && <div>Creating product...</div>}
    </div>
  );
}
