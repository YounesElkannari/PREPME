import { Order } from "@/interfaces/admin"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function OrderIndex() {
    const { t } = useTranslation();
    const [data, setData] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchOrders = () => {
        http.get(apiRoutes.orders).then((res) => {
            setData(res.data.data);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleAnnuleCommande = async (orderId: number) => {
        // Find the order to check its current status
        const order = data.find(o => o.id === orderId);
        
        // Frontend validation: Check if order is in Pending status before cancelling
        if (!order || order.statue !== "Pending") {
            toast.error(t('dashboard.orders.cannot_cancel'));
            return;
        }

        await http.put(apiRoutes.updateMealPreparationStatus(orderId), { statue: "Cancelled" }).then(() => {
            toast.success(t('dashboard.orders.cancelled_success'));
            fetchOrders();
        }).catch((error) => {
            console.error("Error cancelling order:", error);
            // Handle backend validation errors
            if (error.response?.status === 422) {
                toast.error(error.response?.data?.message || t('dashboard.orders.cannot_cancel'));
            } else {
                toast.error(t('dashboard.orders.cancel_error'));
            }
        });


    };

    return (
        <>
            <div className="flex justify-between items-center w-full mb-4">
                <h1 className="text-3xl font-bold m-2">{t('dashboard.orders.title')}</h1>
                {/* <Button
                    onClick={() => {
                        navigate(webRoutes.dashboard_orders_add);
                    }}
                >
                    {t('dashboard.orders.new_order')}
                </Button> */}
            </div>

            <DataTable columns={columns(handleAnnuleCommande)} data={data} loading={loading} />
        </>

    )
}
