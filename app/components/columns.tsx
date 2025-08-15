import { Blog, Category, Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CategoryGroup } from "@prisma/client";

export const productColumns: (categories: any[]) => ColumnDef<Product>[] = (
  categories
) => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description ?? "—",
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    enableSorting: false,
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
    enableSorting: true,
    cell: ({ row }) =>
      row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleDateString()
        : "—",
  },
  {
    accessorKey: "categoryId",
    header: "Category",
    cell: ({ row }) => {
      const categoryId = row.original.categoryId;
      const category = categories.find((cat) => cat.id === categoryId);
      return category ? category.name : "N/A";
    },
  },
];
export const blogColumns: ColumnDef<Blog>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "body",
    header: "Body",
  },
  {
    accessorKey: "photoUrl",
    header: "Image",
    cell: ({ row }) =>
      row.original.photoUrl ? (
        <img
          src={row.original.photoUrl}
          alt={row.original.title}
          style={{ width: 60, height: 60, objectFit: "cover" }}
        />
      ) : (
        "—"
      ),
  },
];
export const categoryColumns = (
  categoryGroups: CategoryGroup[]
): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "categoryGroupId",
    header: "Category Group",
    cell: ({ row }) => {
      const groupId = row.original.categoryGroupId;
      const group = categoryGroups.find((g) => g.id === groupId);
      return group ? group.name : "N/A";
    },
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
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "affil",
    header: "Affiliation",
  },
  {
    accessorKey: "categoriesCount", // Use a unique accessorKey
    header: "Categories Count",
    cell: ({ row }) => row.original._count?.categories ?? "—",
  },
];
