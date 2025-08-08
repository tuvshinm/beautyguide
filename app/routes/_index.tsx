import type { MetaFunction } from "@remix-run/node";
/// <reference types="facebook-js-sdk" />
import { Header } from "~/components/ui/header";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
export async function loader() {
  const categoryGroups = await db.categoryGroup.findMany({
    include: {
      categories: true,
    },
  });
  return json({ categoryGroups });
}
export const meta: MetaFunction = () => {
  return [
    { title: "Beauty Guide" },
    { name: "description", content: "Beauty!" },
  ];
};

export default function Index() {
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
    <div>
      <Header
        categoryGroups={categoryGroups}
        handleFacebookLogin={handleFacebookLogin}
      />
    </div>
  );
}
