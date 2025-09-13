import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.slug;
  const product = await db.product.findUnique({
    where: {
      id: slug,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });
  return { product };
};

export default function PostSlug() {
  const { product } = useLoaderData<typeof loader>();
  if (!product) {
    return <div>Product not found</div>;
  }
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{product.name}</h1>
      <img
        src={product.imageUrl as string}
        alt={product.name}
        className="w-64 h-64"
      />
      <p>{product.description}</p>
      <p>{product.category.name}</p>
    </main>
  );
}
