import { Category } from "@prisma/client";
import React from "react";
import CategoryItem from "./category-item";

interface CategoriesListProps {
  categories: Category[];
}

export default function CategoriesList({ categories }: CategoriesListProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((category) => {
        return (
          <CategoryItem
            key={category.id}
            label={category.name}
            value={category.id}
          />
        );
      })}
    </div>
  );
}
