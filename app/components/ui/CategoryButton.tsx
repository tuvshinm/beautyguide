import React from "react";
import { CollapsibleKey } from "../types";
interface CategoryButtonProps {
  label: string;
  value: CollapsibleKey;
  currentCollapsible: CollapsibleKey;
  setCurrentCollapsible: (value: CollapsibleKey) => void;
  setIsOpen: (open: boolean) => void;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  label,
  value,
  currentCollapsible,
  setCurrentCollapsible,
  setIsOpen,
}) => {
  const isActive = currentCollapsible === value;

  const handleClick = () => {
    if (isActive) {
      setIsOpen(false);
      setCurrentCollapsible("none");
    } else {
      setCurrentCollapsible(value);
      setIsOpen(true);
    }
  };

  return (
    <h1 className={`cursor-pointer`} onClick={handleClick}>
      {label}
    </h1>
  );
};
