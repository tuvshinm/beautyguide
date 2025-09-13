import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
export async function loader() {
  const products = await db.product.findMany({
    skip: 0,
    take: 10,
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });
  return { products };
}

export default function ProductIndex() {
  const { products } = useLoaderData<typeof loader>();
  return (
    <div>
      {products.map((product) => (
        <a
          key={product.id}
          className="items-center flex flex-row justify-evenly"
          href={`/products/${product.id}`}
        >
          <h1>{product.name}</h1>
          <h1>{product.description}</h1>
          <img
            src={product.imageUrl as string}
            alt={product.name}
            className="w-32 h-32"
          />
          <p>{product.category.name}</p>
        </a>
      ))}
    </div>
  );
}
