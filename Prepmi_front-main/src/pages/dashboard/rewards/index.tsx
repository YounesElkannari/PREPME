import { Reward } from "./columns";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { DataTable } from "./data-table";

export default function RewardsIndex() {
  const [data, setData] = useState<Reward[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    http.get(apiRoutes.rewards).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div className="flex justify-between items-center w-full mb-4">
        <h1 className="text-3xl font-bold m-2">Récompenses</h1>
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
    </>
  );
}