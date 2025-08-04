import { Affiliation } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log("Received:", formData);
  const newCategoryGroup = {
    name: formData.get("name") as string,
    affil: formData.get("affil") as Affiliation,
  };
  console.log("Creating new category group:", newCategoryGroup);
  const response = await db.categoryGroup.create({ data: newCategoryGroup });
  return response;
};
