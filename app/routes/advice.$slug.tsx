import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.slug;
  const blog = await db.blog.findUnique({
    where: {
      id: slug,
    },
    include: {
      comment: {
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        select: { id: true },
      },
    },
  });
  return { blog };
};

export default function AdviceSlug() {
  const { blog } = useLoaderData<typeof loader>();
  if (!blog) {
    return <div>Product not found</div>;
  }
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{blog.title}</h1>
      {blog?.photoUrl && (
        <img
          src={blog.photoUrl}
          alt={blog.title}
          className="h-12 border-2 border-black m-[20px]"
        />
      )}
      <p>{blog.body}</p>
    </main>
  );
}
