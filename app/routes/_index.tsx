import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Header } from "~/components/ui/header";
import { db } from "~/utils/db.server";
import { handleFacebookLogin } from "~/lib/utils";
export async function loader() {
  const categoryGroups = await db.categoryGroup.findMany({
    include: {
      categories: true,
    },
  });
  return { categoryGroups };
}
export const meta: MetaFunction = () => {
  return [
    { title: "Beauty Guide" },
    { name: "description", content: "Beauty!" },
  ];
};

export default function Index() {
  const { categoryGroups } = useLoaderData<typeof loader>();

  return (
    <div>
      <Header
        categoryGroups={categoryGroups}
        handleFacebookLogin={handleFacebookLogin}
      />
    </div>
  );
}
