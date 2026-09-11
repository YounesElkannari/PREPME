import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { useTranslation } from "react-i18next";

interface Setting {
  id: number;
  key: string;
  value: string;
  type: 'string' | 'integer' | 'boolean' | 'json' | 'image';
  description: string;
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<Setting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = () => {
    setLoading(true);
    http.get(apiRoutes.settings)
      .then((res) => {
        console.log(res.data);
        const settingsData = res.data.data || res.data;
        setData(settingsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching settings:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center w-full mb-4">
        <div>
          <h1 className="text-3xl font-bold m-2">{t('dashboard.settings.title')}</h1>
          <p className="text-muted-foreground m-2">{t('dashboard.settings.subtitle')}</p>
        </div>
      </div>

      <DataTable columns={columns} data={data} loading={loading} onRefresh={fetchSettings} />
    </>
  )
}
