import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "~/components/ui/drawer";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";

// Make sure to update this type with the new dynamic properties
export type FieldConfig<T> = {
  key: keyof T;
  label: string;
  type: "text" | "select" | "date" | "image" | "hidden";
  options?:
    | { value: string; label: string }[]
    | ((item: T) => { value: string; label: string }[]);
  disabled?: boolean | ((item: T) => boolean);
  placeholder?: string | ((item: T) => string);
};

type EntityDrawerViewerProps<T> = {
  item: T;
  fields: FieldConfig<T>[]; // Updated to use the new generic type
  triggerLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (values: Partial<T>) => void;
};

export function EntityDrawerViewer<T extends Record<string, any>>({
  item,
  fields,
  open,
  onOpenChange,
  onSubmit,
}: EntityDrawerViewerProps<T>) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values: Partial<T> = {};

    fields.forEach((field) => {
      // Exclude "image" and other non-form-input types from being processed here
      if (field.type !== "image") {
        const val = formData.get(field.key as string);
        if (val !== null) {
          // You may want to add more type-specific parsing here if needed
          values[field.key] = val as T[keyof T];
        }
      }
    });

    onSubmit?.(values);
    onOpenChange?.(false);
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.name ?? item.id}</DrawerTitle>
          <DrawerDescription>{item.description ?? ""}</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 overflow-y-auto px-4 text-sm"
        >
          {fields.map((field) => {
            // Check if the properties are functions and resolve them here
            const isDisabled =
              typeof field.disabled === "function"
                ? field.disabled(item)
                : field.disabled;
            const fieldOptions =
              typeof field.options === "function"
                ? field.options(item)
                : field.options;
            const placeholder =
              typeof field.placeholder === "function"
                ? field.placeholder(item)
                : field.placeholder;

            if (field.type === "hidden") {
              return (
                <Input
                  key={field.key as string}
                  type="hidden"
                  name={field.key as string}
                  defaultValue={item[field.key]}
                />
              );
            }

            return (
              <div key={field.key as string} className="flex flex-col gap-3">
                <Label htmlFor={field.key as string}>{field.label}</Label>
                {field.type === "text" && (
                  <Input
                    id={field.key as string}
                    name={field.key as string}
                    defaultValue={item[field.key]}
                    disabled={isDisabled}
                    placeholder={placeholder}
                  />
                )}
                {field.type === "date" && (
                  <Input
                    id={field.key as string}
                    name={field.key as string}
                    type="date"
                    defaultValue={item[field.key]}
                    disabled={isDisabled}
                    placeholder={placeholder}
                  />
                )}
                {field.type === "image" && item[field.key] && (
                  <img
                    src={item[field.key]}
                    alt={field.label}
                    style={{ width: 80, height: 80 }}
                  />
                )}
                {field.type === "select" && fieldOptions && (
                  <Select
                    name={field.key as string}
                    defaultValue={item[field.key]}
                    disabled={isDisabled}
                  >
                    <SelectTrigger id={field.key as string} className="w-full">
                      <SelectValue
                        placeholder={placeholder || `Select ${field.label}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            );
          })}
          <DrawerFooter>
            <Button type="submit">Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
