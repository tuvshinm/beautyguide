import { Affiliation, Blog, Category, Product } from "@prisma/client";
import { ColumnDef as BaseColumnDef } from "@tanstack/react-table";
import { CategoryGroup } from "@prisma/client";
type ColumnDef<TData> = BaseColumnDef<TData> & {
  enableEditing?: boolean;
};
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
export type categoryColumnsWithCount = Category & {
  _count?: {
    categories: number;
  };
  settings?: {
    "no-edit"?: boolean;
  };
};
export const categoryColumns = (
  categoryGroups: CategoryGroup[]
): ColumnDef<categoryColumnsWithCount>[] => [
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
  {
    accessorKey: "productsCount",
    header: "Products Count",
    cell: ({ row }) => row.original._count?.categories ?? "—",
    enableEditing: false,
  },
];
export type CategoryGroupWithCount = CategoryGroup & {
  _count?: {
    categories: number;
  };
};
export const AffiliationLabels: Record<Affiliation, string> = {
  [Affiliation.PRODUCT]: "Product",
  [Affiliation.SERVICE]: "Service",
  [Affiliation.BLOG]: "Blog",
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
    cell: ({ row }) => {
      const affilValue: Affiliation = row.original.affil; // enum number
      return AffiliationLabels[affilValue] ?? "N/A";
    },
  },
  {
    accessorKey: "categoriesCount", // Use a unique accessorKey
    header: "Categories Count",
    cell: ({ row }) => row.original._count?.categories ?? "—",
    enableEditing: false,
  },
];
