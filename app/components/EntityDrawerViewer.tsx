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
import { useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";

export type FieldConfig<T> = {
  key: keyof T;
  label: string;
  type: "text" | "select" | "date" | "image" | "hidden" | "field";
  options?:
    | { value: string; label: string }[]
    | ((item: T) => { value: string; label: string }[]);
  disabled?: boolean | ((item: T) => boolean);
  placeholder?: string | ((item: T) => string);
};
function useDebounceEffect(effect: () => void, deps: any[], delay: number) {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);
    return () => clearTimeout(handler);
  }, [...deps, delay]);
}

type EntityDrawerViewerProps<T> = {
  item: T;
  fields: FieldConfig<T>[];
  triggerLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (formData: FormData) => void;
  onDraft?: (formData: FormData) => void;
};

export function EntityDrawerViewer<T extends Record<string, any>>({
  item,
  fields,
  triggerLabel,
  open,
  onOpenChange,
  onSubmit,
  onDraft,
}: EntityDrawerViewerProps<T>) {
  const [formValues, setFormValues] = useState<Partial<T>>({});
  const formRef = useRef<HTMLFormElement | null>(null);

  // Load draft from localStorage when opening (if exists)
  useEffect(() => {
    if (open) {
      const savedDraft = localStorage.getItem("entityDraft");
      if (savedDraft) {
        setFormValues(JSON.parse(savedDraft));
      } else {
        setFormValues(item);
      }
    }
  }, [open, item]);

  // Local storage autosave (fast debounce)
  useDebounceEffect(
    () => {
      if (Object.keys(formValues).length > 0) {
        localStorage.setItem("entityDraft", JSON.stringify(formValues));
      }
    },
    [formValues],
    500
  );

  // Optional server draft save (slower debounce)
  const handleChange = (key: keyof T, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get("_method") === "draft") {
      onDraft?.(formData);
      return;
    }
    onSubmit?.(formData);
    onOpenChange?.(false);
    localStorage.removeItem("entityDraft");
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
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 overflow-y-auto px-4 text-sm"
        >
          <input type="hidden" name="_method" id="_method" />

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

            const value = formValues[field.key] ?? "";

            if (field.type === "hidden") {
              return (
                <Input
                  key={field.key as string}
                  type="hidden"
                  name={field.key as string}
                  value={value as string}
                  onChange={(e) => handleChange(field.key, e.target.value)}
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
                    value={value as string}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    disabled={isDisabled}
                    placeholder={placeholder}
                  />
                )}
                {field.type === "date" && (
                  <Input
                    id={field.key as string}
                    name={field.key as string}
                    type="date"
                    value={value as string}
                    onChange={(e) => handleChange(field.key, e.target.value)}
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
                {field.type === "field" && (
                  <Textarea
                    id={field.key as string}
                    name={field.key as string}
                    value={value as string}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    disabled={isDisabled}
                    placeholder={placeholder}
                  />
                )}
                {field.type === "select" && fieldOptions && (
                  <Select
                    name={field.key as string}
                    value={String(value)}
                    onValueChange={(val) => handleChange(field.key, val)}
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

          <DrawerFooter className="flex justify-end flex-row">
            <Button
              type="submit"
              onClick={() =>
                ((
                  document.getElementById("_method") as HTMLInputElement
                ).value = "")
              }
            >
              Submit
            </Button>

            {onDraft && (
              <Button
                type="submit"
                onClick={() =>
                  ((
                    document.getElementById("_method") as HTMLInputElement
                  ).value = "draft")
                }
              >
                Save Draft
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
