import { db } from "~/utils/db.server";
import { useLoaderData, useActionData } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
export async function loader() {}
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const accountType = formData.get("accountType"); // Temporary, remove after making 1-2 admin accounts or more.
}

export default function loginPage() {
  return <div>Hello World.</div>;
}
