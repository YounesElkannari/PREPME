import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { webRoutes } from "@/routes/web";
import { MealTypesEnum } from "@/enum/MealTypesEnum";
import { Meal } from "@/interfaces/admin";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus, UtensilsCrossed } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [types] = useState([
    { id: MealTypesEnum.Menu, name: t('dashboard.meals.types.menu') },
    { id: MealTypesEnum.Breakfast, name: t('dashboard.meals.types.breakfast') },
    { id: MealTypesEnum.Drink, name: t('dashboard.meals.types.drink') },
    { id: MealTypesEnum.Dessert, name: t('dashboard.meals.types.dessert') },
  ]);

  useEffect(() => {
    // Fetch meals
    http.get(apiRoutes.meals_dashboard).then((res) => {
      console.log(res.data.data);
      setData(res.data.data || []);
      setLoading(false);
    });

    // Fetch categories
    http.get(apiRoutes.categories).then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-[#174622] rounded-xl">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">{t('dashboard.meals.title')}</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {t('dashboard.meals.subtitle')}
          </p>
        </div>

        <Button
          onClick={() => {
            navigate(webRoutes.dashboard_meals_add);
          }}
          style={{ backgroundColor: "#174622" }}
          className="hover:opacity-90 text-white font-bold shadow-md shadow-[#174622]/20 transition-all duration-300 rounded-xl px-5 py-2.5 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t('dashboard.meals.new_meal')}
        </Button>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100/60 overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          categories={categories}
          types={types}
        />
      </div>
    </div>
  );
}