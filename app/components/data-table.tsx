import * as React from "react";
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
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaCheckCircle,
  FaEllipsisV,
  FaGripVertical,
  FaSpinner,
  FaPlus,
  FaChartLine,
} from "react-icons/fa";
import { MdViewColumn } from "react-icons/md";
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

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  createdAt: z.string(), // or z.date() if you parse dates
  categoryId: z.string(),
});

// DragHandle expects string id
export function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <FaGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// DraggableRow for sortable rows
export function DraggableRow({
  row,
}: {
  row: Row<z.infer<typeof productSchema>>;
}) {
  return (
    <TableRow key={row.id} data-id={row.id}>
      <TableCell>
        <DragHandle id={row.id} />
      </TableCell>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function EntityDataTable<T extends Record<string, any>>({
  data: initialData,
  tabs = [],
  tabColumns = {},
  tableLabel = tabs[0]?.value ?? "default",
  drawerFields,
  label,
  onCreate,
}: {
  data: T[];
  tabs: { value: string; label: string; badge?: number }[];
  tabColumns: Record<string, ColumnDef<T>[]>;
  tableLabel?: string;
  drawerFields: FieldConfig[];
  label: string;
  onCreate?: (values: Partial<T>) => void;
}) {
  const [activeTab, setActiveTab] = React.useState(tableLabel);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map((row: any) => row.id) || [],
    [data]
  );

  const columns = tabColumns[activeTab] || [];

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  function handleCreate(values: Partial<T>) {
    if (onCreate) onCreate(values);
    setDrawerOpen(false);
  }

  return (
    <Tabs
      defaultValue={activeTab}
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              {tab.badge ? (
                <Badge variant="secondary">{tab.badge}</Badge>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDrawerOpen(true)}
          >
            <FaPlus />
            <span className="hidden lg:inline">{label}</span>
          </Button>
        </div>
      </div>
      <TabsContent
        value={activeTab}
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
                    <TableHead key="drag" />
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
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
          fields={drawerFields}
          triggerLabel={label}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onSubmit={handleCreate}
        />
      </TabsContent>
    </Tabs>
  );
}

type DatasetOption<T> = {
  key: string;
  label: string; // e.g. "Category", "Category Group"
  data: T[];
  columns: ColumnDef<T>[];
  drawerFields: FieldConfig[];
  buttonLabel: string; // e.g. "New Category", "New Category Group"
  onCreate?: (values: Partial<T>) => void;
};

export function EntityDataTableMulti<T extends Record<string, any>>({
  datasets,
  defaultDatasetKey,
}: {
  datasets: DatasetOption<T>[];
  defaultDatasetKey?: string;
}) {
  const [selectedDatasetKey, setSelectedDatasetKey] = React.useState(
    defaultDatasetKey ?? datasets[0]?.key
  );

  const selectedDataset = React.useMemo(
    () => datasets.find((d) => d.key === selectedDatasetKey) ?? datasets[0],
    [datasets, selectedDatasetKey]
  );

  // All the rest of your state, but scoped to the selected dataset
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [data, setData] = React.useState(() => selectedDataset.data);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  React.useEffect(() => {
    setData(selectedDataset.data);
    setRowSelection({});
    setColumnVisibility({});
    setColumnFilters([]);
    setSorting([]);
    setPagination({ pageIndex: 0, pageSize: 10 });
  }, [selectedDatasetKey, selectedDataset.data]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map((row: any) => row.id) || [],
    [data]
  );

  const columns = selectedDataset.columns;

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  function handleCreate(values: Partial<T>) {
    if (selectedDataset.onCreate) selectedDataset.onCreate(values);
    setDrawerOpen(false);
  }

  return (
    <div className="w-full flex-col justify-start gap-6">
      {/* Dataset selector */}
      <div className="flex items-center justify-between px-4 lg:px-6 mb-2">
        <div>
          <select
            className="border rounded px-2 py-1"
            value={selectedDatasetKey}
            onChange={(e) => setSelectedDatasetKey(e.target.value)}
          >
            {datasets.map((ds) => (
              <option key={ds.key} value={ds.key}>
                {ds.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
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
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
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
                    <TableHead key="drag" />
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
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
          fields={selectedDataset.drawerFields}
          triggerLabel={selectedDataset.buttonLabel}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onSubmit={handleCreate}
        />
      </div>
    </div>
  );
}
