import { Plan } from "@/interfaces/admin"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { webRoutes } from "@/routes/web";
import { handleErrorResponse } from "@/utils";

export default function index() {
    const navigate = useNavigate();
    const [data, setData] = useState<Plan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPlans = () => {
        http.get(apiRoutes.plans).then((res) => {
            setData(res.data.data);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce plan ?")) {
            return;
        }

        try {
            await http.delete(`${apiRoutes.plans}/${id}`);
            fetchPlans();
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center w-full mb-4">
                <h1 className="text-3xl font-bold m-2">Plans</h1>
                <Button
                    onClick={() => {
                        navigate(webRoutes.dashboard_plans_add);
                    }}
                >
                    Nouveau plan
                </Button>
            </div>

            <DataTable columns={columns({ onDelete: handleDelete })} data={data} loading={loading} />
        </>

    )
}
