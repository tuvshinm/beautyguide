import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
export async function loader() {
  const userCount = await db.user.count({});
  const reviewCount = await db.review.count({});
  const productCount = await db.product.count({});
  const categoryCount = await db.category.count({});
  const categoryGroupCount = await db.categoryGroup.count({});
  return Response.json({
    userCount,
    reviewCount,
    productCount,
    categoryCount,
    categoryGroupCount,
  });
}
export const meta: MetaFunction = () => {
  return [{ title: "Dashboard" }, { name: "description", content: "Beauty!" }];
};

export default function Page() {
  const {
    userCount,
    reviewCount,
    productCount,
    categoryCount,
    categoryGroupCount,
  } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div>User Count: {userCount}</div>
      <div>Review Count: {reviewCount}</div>
      <div>Product Count: {productCount}</div>
      <div>Category Count: {categoryCount}</div>
      <div>Category Group Count: {categoryGroupCount}</div>
    </div>
  );
}
