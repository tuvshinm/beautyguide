import { ColumnDef } from "@tanstack/react-table";
import { FieldConfig } from "./EntityDrawerViewer";

export type CollapsibleKey = "none" | "PRODUCT" | "SERVICE" | "BLOG";
export type DatasetOption<T extends Record<string, any>> = {
  key: string;
  label: string;
  data: T[];
  columns: ColumnDef<T>[];
  drawerFields: FieldConfig<T>[] | ((data: T[]) => FieldConfig<T>[]);
  buttonLabel: string;
  badge?: number;
  onCreate: (formData: FormData) => void;
  onDelete?: (ids: string[]) => void;
  onUpdate?: (updatedItems: T[]) => void;
  onDraft?: (formData: FormData) => void;
  dropdownOptions?: Record<string, { value: string; label: string }[]>;
};
