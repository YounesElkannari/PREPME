import { Collaborator } from "@/interfaces/admin"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";

export default function CollaboratorsPage() {
    const [data, setData] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        http.get(apiRoutes.collaborations).then((res) => {
            console.log(res.data);
            setData(res.data);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching collaborators:', error);
            setLoading(false);
        });
    }, []);

    return (
        <>
            <div className="flex justify-between items-center w-full mb-4">
                <h1 className="text-3xl font-bold m-2">Collaborateurs</h1>
            </div>

            <DataTable columns={columns} data={data} loading={loading} />
        </>
    )
}