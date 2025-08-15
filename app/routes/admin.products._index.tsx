import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { EntityDataTable } from "~/components/data-table";
import { db } from "~/utils/db.server";
import { productColumns } from "~/components/columns";
import { uploadToCloudinary } from "~/utils/cloudinary.server";
import { Product } from "@prisma/client";
import { productDrawerFields } from "~/components/drawers";
import type { DatasetOption } from "~/components/types";
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
  const method = formData.get("_method");
  if (method === "delete") {
    const ids = formData.getAll("ids") as string[];
    await db.product.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    return null;
  }
  if (method === "update") {
    const updatedItems = JSON.parse(formData.get("updatedItems") as string);
    // You would typically use a transaction for batch updates
    for (const item of updatedItems) {
      await db.product.update({
        where: { id: item.id },
        data: item,
      });
    }
    return null;
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const imageFile = formData.get("imageUrl") as File; // <-- Use the correct key

  let imageUrl = "";

  // The critical part: robustly check for a valid file
  if (
    imageFile &&
    imageFile.size > 0 &&
    typeof imageFile.arrayBuffer === "function"
  ) {
    try {
      // Pass the file directly to the server-side function
      const result = await uploadToCloudinary(imageFile);
      imageUrl = result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return new Response("Image upload failed.", { status: 500 });
    }
  } else {
    console.error("No valid image file received. Received file:", imageFile);
  }

  const newProduct = {
    name,
    description,
    imageUrl,
    categoryId,
  };

  const response = await db.product.create({
    data: newProduct,
    include: { category: true },
  });

  return new Response(JSON.stringify(response), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export const meta: MetaFunction = () => {
  return [{ title: "Products" }, { name: "description", content: "Beauty!" }];
};
export default function ProductIndex() {
  const { products, categorys } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  async function handleCreate(formData: FormData) {
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
    formData.append("_method", "delete");
    fetcher.submit(formData, { method: "post" });
  }
  async function handleUpdate(updatedItems: any[]) {
    const formData = new FormData();
    formData.append("_method", "update");
    formData.append("updatedItems", JSON.stringify(updatedItems));
    fetcher.submit(formData, { method: "post" });
  }

  const productDataset: DatasetOption<Product> = {
    key: "products",
    label: "Products",
    data: products,
    columns: productColumns(categorys),
    drawerFields: productDrawerFields(categorys),
    buttonLabel: "Add Product",
    onCreate: handleCreate,
    onDelete: handleDelete,
    onUpdate: handleUpdate,
    dropdownOptions: {
      categoryId: categorys.map((cat: { id: any; name: any }) => ({
        value: cat.id,
        label: cat.name,
      })),
    },
  };
  return <EntityDataTable datasets={[productDataset]} />;
}
