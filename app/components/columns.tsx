import { Category, Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CategoryGroup } from "@prisma/client";

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description ?? "—",
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) =>
      row.original.imageUrl ? (
        <img
          src={row.original.imageUrl}
          alt={row.original.name}
          style={{ width: 40, height: 40, objectFit: "cover" }}
        />
      ) : (
        "—"
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleDateString()
        : "—",
  },
  {
    accessorKey: "categoryId",
    header: "Category ID",
    cell: ({ row }) => row.original.categoryId,
  },
];

export const categoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "categoryGroupId",
    header: "Category Group ID",
    cell: ({ row }) => row.original.categoryGroupId,
  },
];
export type CategoryGroupWithCount = CategoryGroup & {
  _count?: {
    categories: number;
  };
};

export const categoryGroupColumns: ColumnDef<CategoryGroupWithCount>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.original.id,
  },
  {
    accessorKey: "affil",
    header: "Affiliation",
    cell: ({ row }) => row.original.affil,
  },
  {
    header: "Categories Count",
    cell: ({ row }) => row.original._count?.categories ?? "—",
  },
];
