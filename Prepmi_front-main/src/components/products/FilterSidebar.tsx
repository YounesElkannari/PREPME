import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Checkbox } from "../ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Categorie, Unite } from "@/interfaces/admin";
interface FilterSidebarProps {
  categories: Categorie[];
  selectedCategories: number[];
  selectedUnites: number[];
  searchTerm: string;
  unites: Unite[];
  onCategoryChange: (category: number) => void;
  onUniteChange: (unite: number) => void;
  onSearchChange: (value: string) => void;
}
export const FilterSidebar = ({
  categories,
  selectedCategories,
  selectedUnites,
  searchTerm,
  unites,
  onCategoryChange,
  onSearchChange,
  onUniteChange

}: FilterSidebarProps) => {

  const { t } = useTranslation();
  return (
    <div className="w-full md:w-64 p-4 bg-card rounded-lg shadow-sm">
      <div className="mb-6">
        <h3 className="font-semibold mb-3">{t("search")}</h3>
        <Input
          type="search"
          placeholder={t("search_placeholder")}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="categories">
            <AccordionTrigger>
              {t('categories')}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => onCategoryChange(category.id)}
                    />
                    <Label className="text-sm cursor-pointer">
                      {category.name[i18next.language]}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="w-full">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="unites">
            <AccordionTrigger>
              {t('unites')}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {unites.map((untie) => (
                  <div key={untie.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={untie.id}
                      checked={selectedUnites.includes(untie.id)}
                      onCheckedChange={() => onUniteChange(untie.id)}
                    />
                    <Label className="text-sm cursor-pointer">
                      {untie.name[i18next.language]}
                    </Label>
                  </div>

                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

    </div>
  );
};