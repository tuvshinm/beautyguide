import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { is } from "zod/v4/locales";
import { blogDrawerFields, categoryDrawerFields } from "~/components/drawers";
import { EntityDrawerViewer } from "~/components/EntityDrawerViewer";
import { Button } from "~/components/ui/button";
import { uploadToCloudinary } from "~/utils/cloudinary.server";
import { db } from "~/utils/db.server";
export async function loader() {
  const blog = await db.blog.findMany();

  return { blog };
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
}

export default function Page() {
  const { blog } = useLoaderData<typeof loader>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const fetcher = useFetcher();
  async function handleCreate(formData: FormData) {
    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  }
  function handleDraft(formData: FormData): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Blog</h1>
      {blog.map((blog) =>
        blog.photoUrl ? (
          <div key={blog.id}>
            <h2>{blog.title}</h2>
            <p>{blog.body}</p>
            <img src={blog.photoUrl} alt={blog.title} className="w-full h-64" />
          </div>
        ) : (
          <div key={blog.id}>
            <h2>{blog.title}</h2>
            <p>{blog.body}</p>
          </div>
        )
      )}
      <Button onClick={() => setDrawerOpen(true)}>Create Blog Post</Button>
      <EntityDrawerViewer
        item={{} as any}
        fields={blogDrawerFields}
        triggerLabel={"Create Blog Post"}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSubmit={handleCreate}
        onDraft={handleDraft}
      />
    </div>
  );
}
