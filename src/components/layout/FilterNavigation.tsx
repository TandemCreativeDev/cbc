import { useLanguage } from "@/context/LanguageContext";
import FilterButton from "@/components/ui/FilterButton";

interface FilterNavigationProps {
  categories: string[];
  selectedCategory: string | number | readonly string[] | undefined;
  onCategoryChange: (category: string) => void;
  ariaLabel?: string;
  announcementId?: string;
}

export default function FilterNavigation({
  categories,
  selectedCategory,
  onCategoryChange,
  ariaLabel,
  announcementId,
}: FilterNavigationProps) {
  const { isFrench } = useLanguage();

  const defaultAriaLabel = isFrench
    ? "Filtres de catégories"
    : "Category filters";

  return (
    <nav
      id="category-filters"
      aria-label={ariaLabel || defaultAriaLabel}
      className="mb-10"
    >
      <ul className="flex justify-between overflow-x-scroll gap-3 no-scrollbar">
        {categories.map((category) => (
          <li key={category}>
            <FilterButton
              filter={category}
              isSelected={selectedCategory === category}
              onClick={() => onCategoryChange(category)}
              aria-describedby={announcementId}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
