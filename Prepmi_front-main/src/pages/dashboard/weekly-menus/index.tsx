import { WeeklyMenu } from "@/interfaces/admin"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { webRoutes } from "@/routes/web";

export default function WeeklyMenusIndex() {
  const navigate = useNavigate();
  const [data, setData] = useState<WeeklyMenu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchWeeklyMenus();
  }, []);

  const fetchWeeklyMenus = () => {
    setLoading(true);
    http.get(apiRoutes.weeklyMenus).then((res) => {
      console.log(res.data.data);
      setData(res.data.data);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching weekly menus:", error);
      setLoading(false);
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce menu hebdomadaire ?")) {
      http.delete(`${apiRoutes.weeklyMenus}/${id}`).then(() => {
        fetchWeeklyMenus();
      }).catch((error) => {
        console.error("Error deleting weekly menu:", error);
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center w-full mb-4">
        <div>
          <h1 className="text-3xl font-bold">Menus Hebdomadaires</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos menus de la semaine
          </p>
        </div>
        <Button
          onClick={() => {
            navigate(webRoutes.dashboard_weekly_menus_add);
          }}
        >
          Nouveau menu
        </Button>
      </div>

      <DataTable columns={columns} data={data} loading={loading} onDelete={handleDelete} />
    </>
  )
}
