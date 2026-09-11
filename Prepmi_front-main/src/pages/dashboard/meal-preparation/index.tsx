import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarView } from "./calendar-view"
import { MealPreparation } from "@/interfaces/admin"
import { handleErrorResponse } from "@/utils";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function MealPreparationIndex() {
    const { t } = useTranslation();
    const [data, setData] = useState<MealPreparation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [view, setView] = useState<"table" | "calendar">("table");

    const fetchMealPreparations = () => {
        // Replace with your actual API endpoint for meal preparations
        http.get(apiRoutes.mealPreparations).then((res) => {
            console.log("ha hwa lwal :", res.data.data);
            setData(res.data.data);
            setLoading(false);
        }).catch(() => {
            // setData(mockMealPreparations);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchMealPreparations();
    }, []);

    // Adapted to handle both flat and nested backend data
    const groupByOrder = (items: any[]) => {
        // If items are flat meal preparations (old format)
        if (items.length && items[0]?.order_num) {
            const grouped: Record<string, any> = {};
            items.forEach(item => {
                const orderNum = item.order_num;
                if (!grouped[orderNum]) {
                    grouped[orderNum] = {
                        order_num: orderNum,
                        meals: [],
                        order_status: item.order_status,
                        order_id: item.order_id,
                        size: item.size,
                    };
                }
                grouped[orderNum].meals.push({
                    name: item.meal?.name,
                    quantity: item.quantity,
                    order_meal_id: item.order_meal_id,
                    size: item.size,
                });
            });
            return Object.values(grouped);
        }
        // If items are nested order objects (new format)
        if (items.length && items[0]?.order_meals) {
            return items.map(order => ({
                order_num: order.num_order || order.order_num,
                order_status: order.statue || order.order_status,
                order_id: order.id || order.order_id,
                deliveries: order.deliveries || [],
                meals: order.order_meals.map((mealItem: any) => ({
                    name: mealItem.meal?.name,
                    quantity: mealItem.quantity,
                    order_meal_id: mealItem.id || mealItem.order_meal_id,
                    size: order.size,
                }))
            }));
        }
        // Fallback: return empty array
        return [];
    };

    const allowedStatuses = [
        "Pending",
        "Preparing",
        "Shipped",
        "Delivered",
        "Cancelled",

    ];

    const handleStatusUpdate = async (orderId: string, status: string): Promise<void> => {
        if (!allowedStatuses.includes(status)) {
            toast.error(t('dashboard.meal_preparation.invalid_status'));
            throw new Error("Statut sélectionné invalide.");
        }

        // Frontend validation: Cannot cancel if order is not in Pending status
        if (status === "Cancelled") {
            const order = groupByOrder(data).find(o => o.order_id === parseInt(orderId, 10));
            if (!order || order.order_status !== "Pending") {
                toast.error(t('dashboard.meal_preparation.cannot_cancel'));
                throw new Error("Cannot cancel non-pending order");
            }
        }

        const id = parseInt(orderId, 10);
        console.log("Updating order", id, "to status", status);
        try {
            await http.put(apiRoutes.updateMealPreparationStatus(id), { statue: status });
            fetchMealPreparations();
            toast.success("Statut mis à jour avec succès");
        } catch (error) {
            handleErrorResponse(error);
            throw error;
        }
    };

    return (
        <div className="w-full h-full">
            <div className="flex justify-between items-center w-full mb-4">
                <h1 className="text-3xl font-bold m-2">{t('dashboard.meal_preparation.title')}</h1>
            </div>

            <Tabs value={view} onValueChange={(v) => setView(v as "table" | "calendar")} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
                    <TabsTrigger value="table">{t('dashboard.meal_preparation.list_view')}</TabsTrigger>
                    <TabsTrigger value="calendar">{t('dashboard.meal_preparation.calendar_view')}</TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="w-full">
                    <DataTable
                        columns={columns(handleStatusUpdate)}
                        data={groupByOrder(data)}
                        loading={loading}
                    />
                </TabsContent>

                <TabsContent value="calendar" className="w-full">
                    <CalendarView
                        data={data}
                        loading={loading}
                        onStatusUpdate={handleStatusUpdate}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
