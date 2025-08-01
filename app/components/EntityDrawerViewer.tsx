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

export type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "image";
  options?: { value: string; label: string }[]; // for select
};

type EntityDrawerViewerProps<T> = {
  item: T;
  fields: FieldConfig[];
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
  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.name ?? item.id}</DrawerTitle>
          <DrawerDescription>{item.description ?? ""}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-3">
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === "text" && (
                  <Input id={field.key} defaultValue={item[field.key] ?? ""} />
                )}
                {field.type === "date" && (
                  <Input
                    id={field.key}
                    type="date"
                    defaultValue={item[field.key] ?? ""}
                  />
                )}
                {field.type === "image" && item[field.key] && (
                  <img
                    src={item[field.key]}
                    alt={field.label}
                    style={{ width: 80, height: 80 }}
                  />
                )}
                {field.type === "select" && field.options && (
                  <Select defaultValue={item[field.key]}>
                    <SelectTrigger id={field.key} className="w-full">
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </form>
        </div>
        <DrawerFooter>
          <Button
            onClick={() => {
              if (onSubmit) {
                onSubmit(item);
              }
            }}
          >
            Submit
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
