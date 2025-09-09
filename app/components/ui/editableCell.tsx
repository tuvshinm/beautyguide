import { flexRender } from "@tanstack/react-table";
import { useState } from "react";

export function EditableCell({
  cell,
  onEdit,
  dropdownOptions,
}: {
  cell: any;
  onEdit: (id: string, accessorKey: string, value: any) => void;
  dropdownOptions?: Record<string, { value: string; label: string }[]>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(cell.getValue());

  const accessorKey = cell.column.columnDef.accessorKey as string;
  const id = cell.row.original.id;
  const noEdit = cell.column.columnDef.enableEditing === false;
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

  if (noEdit) {
    return (
      <div className="w-full h-full p-2">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    );
  }

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
