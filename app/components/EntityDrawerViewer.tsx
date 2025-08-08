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
import { useEffect, useState } from "react";

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
  fields: FieldConfig<T>[];
  triggerLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Change the onSubmit handler to accept FormData instead of a partial object
  onSubmit?: (formData: FormData) => void;
};

export function EntityDrawerViewer<T extends Record<string, any>>({
  item,
  fields,
  triggerLabel,
  open,
  onOpenChange,
  onSubmit,
}: EntityDrawerViewerProps<T>) {
  // Use local state to manage form values for controlled components
  const [formValues, setFormValues] = useState<Partial<T>>({});

  useEffect(() => {
    // When the drawer opens, reset the form values
    if (open) {
      setFormValues(item);
    }
  }, [open, item]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Debugging: Log the FormData object
    // Use a loop to see what keys and values are in the FormData
    console.log("Client-side FormData content:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    onSubmit?.(formData);
    onOpenChange?.(false);
  };

  const isEditing = !!item?.id;

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>
            {isEditing ? item.name ?? item.id : triggerLabel}
          </DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? item.description ?? ""
              : "Fill out the form to create a new item."}
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 overflow-y-auto px-4 text-sm"
        >
          {fields.map((field) => {
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
                  defaultValue={formValues[field.key] ?? ""}
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
                    defaultValue={formValues[field.key] ?? ""}
                    disabled={isDisabled}
                    placeholder={placeholder}
                  />
                )}
                {field.type === "date" && (
                  <Input
                    id={field.key as string}
                    name={field.key as string}
                    type="date"
                    defaultValue={formValues[field.key] ?? ""}
                    disabled={isDisabled}
                    placeholder={placeholder}
                  />
                )}
                {field.type === "image" && (
                  <Input
                    id={field.key as string}
                    name={field.key as string}
                    type="file"
                    accept="image/*"
                    disabled={isDisabled}
                    placeholder={placeholder}
                  />
                )}
                {field.type === "select" && fieldOptions && (
                  <Select
                    name={field.key as string}
                    defaultValue={String(formValues[field.key] ?? "")}
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
