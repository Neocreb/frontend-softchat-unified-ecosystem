
import {
  Laptop,
  Shirt,
  Watch,
  ShoppingBag,
  Home,
  HeartPulse,
  Scissors,
  Coffee,
  BookOpen,
  Grid
} from "lucide-react";
import { cn } from "@/utils/utils";

interface CategoryMenuProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", label: "All Categories", icon: Grid },
  { id: "electronics", label: "Electronics", icon: Laptop },
  { id: "clothing", label: "Clothing", icon: Shirt },
  { id: "accessories", label: "Accessories", icon: Watch },
  { id: "footwear", label: "Footwear", icon: ShoppingBag },
  { id: "home", label: "Home & Kitchen", icon: Home },
  { id: "beauty", label: "Beauty & Health", icon: HeartPulse },
  { id: "services", label: "Services", icon: Scissors },
  { id: "food", label: "Food & Drinks", icon: Coffee },
  { id: "books", label: "Books & Media", icon: BookOpen },
];

const CategoryMenu = ({ activeCategory, onCategoryChange }: CategoryMenuProps) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3">Categories</h3>
      <div className="space-y-1">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              className={cn(
                "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
                activeCategory === category.id
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "hover:bg-gray-100 text-gray-600"
              )}
              onClick={() => onCategoryChange(category.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryMenu;
