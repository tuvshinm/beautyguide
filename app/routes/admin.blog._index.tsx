import { Blog } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { DatasetOption } from "~/components/types";
import { blogDrawerFields } from "~/components/drawers";
import { EntityDataTable } from "~/components/data-table";
import { uploadToCloudinary } from "~/utils/cloudinary.server";
import { db } from "~/utils/db.server";
import { blogColumns } from "~/components/columns";
export async function loader() {
  const blogs = await db.blog.findMany();
  return { blogs };
}
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const method = formData.get("_method");
  if (method === "delete") {
    const ids = formData.getAll("ids") as string[];
    if (!ids.length) throw new Response("No IDs provided", { status: 400 });
    await db.blog.deleteMany({ where: { id: { in: ids } } });
    return { success: true };
  }
  if (method === "draft" || method === "create") {
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const imageFile = formData.get("photoUrl") as File;
    const isDraft = method === "draft";
    let imageUrl = "";
    if (
      imageFile &&
      imageFile.size > 0 &&
      typeof imageFile.arrayBuffer === "function"
    ) {
      try {
        const result = await uploadToCloudinary(imageFile);
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return new Response("Image upload failed.", { status: 500 });
      }
    }
    const newBlog = {
      title,
      body,
      draft: isDraft,
      ...(imageUrl && { photoUrl: imageUrl }),
    };
    const response = await db.blog.create({ data: newBlog });
    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response("Method not allowed", { status: 405 });
}
export default function BlogIndex() {
  const { blogs } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  async function handleCreate(formData: FormData) {
    formData.append("_method", "create");
    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  }
  async function handleDraft(formData: FormData) {
    formData.append("_method", "draft");
    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  }
  async function handleDelete(ids: string[]) {
    const formData = new FormData();
    ids.forEach((id) => formData.append("ids", id));
    formData.append("_method", "delete");
    fetcher.submit(formData, { method: "post" });
  }
  const blogDataset: DatasetOption<Blog> = {
    key: "blogs",
    label: "Blogs",
    data: blogs,
    columns: blogColumns,
    drawerFields: blogDrawerFields,
    buttonLabel: "Create Blog Post",
    onCreate: handleCreate,
    onDelete: handleDelete,
    onDraft: handleDraft,
  };
  return <EntityDataTable datasets={[blogDataset]} />;
}
