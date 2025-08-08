import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FaChevronUp,
  FaChevronDown,
  FaGripVertical,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { EntityDrawerViewer, FieldConfig } from "./EntityDrawerViewer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  CSSProperties,
  HTMLProps,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);
  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = indeterminate;
    }
  }, [ref, indeterminate]);
  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  createdAt: z.string(),
  categoryId: z.string(),
});

export function DragHandle({
  attributes,
  listeners,
}: {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
}) {
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 cursor-grab hover:bg-transparent active:cursor-grabbing"
    >
      <FaGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}
// Editable Cell component
function EditableCell({
  cell,
  onEdit,
  dropdownOptions, // New prop for dropdown options
}: {
  cell: any;
  onEdit: (id: string, accessorKey: string, value: any) => void;
  dropdownOptions?: Record<string, { value: string; label: string }[]>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(cell.getValue());

  const accessorKey = cell.column.columnDef.accessorKey as string;
  const id = cell.row.original.id;

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== cell.getValue()) {
      onEdit(id, accessorKey, value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  // Check if a dropdown is configured for this accessorKey
  const options = dropdownOptions?.[accessorKey];

  if (isEditing && options) {
    return (
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        autoFocus
        className="w-full h-full p-2 border rounded-md"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (isEditing && accessorKey) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full h-full p-2 border rounded-md"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="w-full h-full cursor-pointer p-2"
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  );
}

export function DraggableRow<T extends Record<string, any>>({
  row,
  onEdit,
  dropdownOptions, // Pass the new prop here
}: {
  row: Row<T>;
  onEdit: (id: string, accessorKey: string, value: any) => void;
  dropdownOptions?: Record<string, { value: string; label: string }[]>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 100 : "auto",
    position: "relative",
  };
  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
    >
      <TableCell>
        <DragHandle attributes={attributes} listeners={listeners} />
      </TableCell>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          <EditableCell
            cell={cell}
            onEdit={onEdit}
            dropdownOptions={dropdownOptions}
          />
        </TableCell>
      ))}
    </TableRow>
  );
}
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
  dropdownOptions?: Record<string, { value: string; label: string }[]>;
};
export function EntityDataTable<T extends Record<string, any>>({
  datasets,
  defaultDatasetKey,
}: {
  datasets: DatasetOption<T>[];
  defaultDatasetKey?: string;
}) {
  const [selectedDatasetKey, setSelectedDatasetKey] = useState(
    defaultDatasetKey ?? datasets[0]?.key
  );
  const [editedItems, setEditedItems] = useState<Record<string, Partial<T>>>(
    {}
  );

  const selectedDataset = useMemo(
    () => datasets.find((d) => d.key === selectedDatasetKey) ?? datasets[0],
    [datasets, selectedDatasetKey]
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState(() => selectedDataset.data);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  useEffect(() => {
    setData(selectedDataset.data);
    setRowSelection({});
    setColumnVisibility({});
    setColumnFilters([]);
    setSorting([]);
    setPagination({ pageIndex: 0, pageSize: 10 });
    setEditedItems({}); // Clear edits on tab change
  }, [selectedDatasetKey, selectedDataset.data]);

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map((row: any) => row.id) || [],
    [data]
  );

  const columns = useMemo(() => {
    const selectionColumn: ColumnDef<T> = {
      id: "select",
      header: ({ table }) => (
        <IndeterminateCheckbox
          className="size-4"
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label="Select all rows on this page"
        />
      ),
      cell: ({ row }) => (
        <IndeterminateCheckbox
          className="size-4"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
    };
    return [selectionColumn, ...selectedDataset.columns];
  }, [selectedDataset.columns]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row: any) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Function to handle cell edits
  const onEdit = (id: string, accessorKey: string, value: any) => {
    setData((old) =>
      old.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            [accessorKey]: value,
          };
        }
        return row;
      })
    );
    setEditedItems((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [accessorKey]: value },
    }));
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((currentData) => {
        const oldIndex = currentData.findIndex((item) => item.id === active.id);
        const newIndex = currentData.findIndex((item) => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return currentData;
        return arrayMove(currentData, oldIndex, newIndex);
      });
    }
  }

  async function handleDelete() {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const numSelected = selectedRows.length;
    if (numSelected === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${numSelected} ${
          numSelected === 1 ? "entry" : "entries"
        }?`
      )
    ) {
      const idsToDelete = selectedRows.map((row) => row.id);
      if (selectedDataset.onDelete) {
        await selectedDataset.onDelete(idsToDelete);
      }
      setData((current) =>
        current.filter((row) => !idsToDelete.includes(row.id))
      );
      setRowSelection({});
    }
  }

  const handleCreate = async (formData: FormData) => {
    if (selectedDataset?.onCreate) {
      await selectedDataset.onCreate(formData); // <-- No conversion needed
    }
  };

  const handleSave = () => {
    if (selectedDataset.onUpdate) {
      const updatedItems = Object.entries(editedItems).map(
        ([id, changes]) =>
          ({
            ...data.find((item) => item.id === id),
            ...changes,
          } as T)
      );
      selectedDataset.onUpdate(updatedItems);
      setEditedItems({}); // Clear temporary changes after saving
    }
  };

  const resolvedDrawerFields = useMemo(() => {
    return typeof selectedDataset.drawerFields === "function"
      ? selectedDataset.drawerFields(data)
      : selectedDataset.drawerFields;
  }, [selectedDataset.drawerFields, data]);

  return (
    <Tabs
      defaultValue={selectedDatasetKey}
      value={selectedDatasetKey}
      onValueChange={setSelectedDatasetKey}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TabsList>
          {datasets.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
              {tab.badge ? (
                <Badge variant="secondary">{tab.badge}</Badge>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex items-center gap-2">
          {Object.keys(editedItems).length > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-1"
            >
              <span>Save Changes ({Object.keys(editedItems).length})</span>
            </Button>
          )}
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-1"
            >
              <FaTrash />
              <span>
                Delete ({table.getFilteredSelectedRowModel().rows.length})
              </span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDrawerOpen(true)}
          >
            <FaPlus />
            <span className="hidden lg:inline">
              {selectedDataset.buttonLabel}
            </span>
          </Button>
        </div>
      </div>
      <TabsContent
        value={selectedDatasetKey}
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    <TableHead key="drag" className="w-8" />
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "flex items-center gap-2 cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <FaChevronUp className="size-3" />,
                              desc: <FaChevronDown className="size-3" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow
                        key={row.id}
                        row={row}
                        onEdit={onEdit}
                        dropdownOptions={selectedDataset.dropdownOptions} // Pass the dropdown options here
                      />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <EntityDrawerViewer
          item={{} as T}
          fields={resolvedDrawerFields}
          triggerLabel={selectedDataset.buttonLabel}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onSubmit={handleCreate}
        />
      </TabsContent>
    </Tabs>
  );
}
