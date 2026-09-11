import { Partner } from "@/interfaces/admin"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";

export default function PartnersPage() {
    const [data, setData] = useState<Partner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        http.get(apiRoutes.teamPartnerships).then((res) => {
            console.log(res.data);
            setData(res.data);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching partners:', error);
            setLoading(false);
        });
    }, []);

    return (
        <>
            <div className="flex justify-between items-center w-full mb-4">
                <h1 className="text-3xl font-bold m-2">Partenaires</h1>
            </div>

            <DataTable columns={columns} data={data} loading={loading} />
        </>
    )
}