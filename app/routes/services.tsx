import type { MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Header } from "~/components/ui/header";
import { db } from "~/utils/db.server";
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

export default function ServiceIndex() {
  const { categoryGroups } = useLoaderData<typeof loader>();
  const handleFacebookLogin = () => {
    FB.login(
      (response) => {
        if (response.authResponse) {
          console.log("Logged in!", response);
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile,email" }
    );
  };
  return (
    <>
      <Header
        categoryGroups={categoryGroups}
        handleFacebookLogin={handleFacebookLogin}
      />
      <Outlet />
    </>
  );
}
