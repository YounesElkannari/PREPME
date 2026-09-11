import { MealPreparation } from "@/interfaces/admin"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { format, isSameDay, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CalendarViewProps {
    data: MealPreparation[]
    loading: boolean
    onStatusUpdate: (orderId: string, status: string) => Promise<void>
}

const statusConfig = {
    Pending: {
        label: "En attente",
        variant: "bg-yellow-500 hover:bg-yellow-600",
    },

    Preparing: {
        label: "En préparation",
        variant: "bg-cyan-500 hover:bg-cyan-600",
    },
    Shipped: {
        label: "Expédié",
        variant: "bg-indigo-500 hover:bg-indigo-600",
    },
    Delivered: {
        label: "Livré",
        variant: "bg-green-500 hover:bg-green-600",
    },
    Cancelled: {
        label: "Annulé",
        variant: "bg-red-500 hover:bg-red-600",
    },

};



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

export function CalendarView({ data, loading, onStatusUpdate }: CalendarViewProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())



    // Get dates that have orders
    const datesWithOrders = data.map((order: any) => parseISO(order.created_at))


    // Filter orders for selected date
    const filteredOrders = data.filter((order: any) =>
        selectedDate && isSameDay(parseISO(order.created_at), selectedDate)
    );

    // Group by order_num
    const groupedOrders = groupByOrder(filteredOrders);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Calendrier de préparation</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={fr}
                        className="rounded-md border"
                        modifiers={{
                            hasOrders: datesWithOrders
                        }}
                        modifiersStyles={{
                            hasOrders: {
                                backgroundColor: 'hsl(var(--primary))',
                                color: 'white',
                                fontWeight: 'bold'
                            }
                        }}
                    />
                </CardContent>
            </Card>

            {/* Orders List Section */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>
                            {selectedDate ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr }) : "Sélectionnez une date"}
                        </CardTitle>
                        <Badge variant="outline" className="text-lg px-4 py-1">
                            {data.length} commandes
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {groupedOrders.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="text-lg">Aucune commande à préparer pour cette date</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[500px] pr-4">
                            <div className="space-y-4">
                                {groupedOrders.map((order, idx) => (
                                    <Card key={order.order_num + idx} className="overflow-hidden">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">
                                                            N° Commande: {order.order_num}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Client: {order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : "N/A"}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline" className="text-xl font-bold px-4 py-2">
                                                        {order.meals.reduce((sum: number, m: any) => sum + m.quantity, 0)} repas
                                                    </Badge>
                                                </div>
                                                {/* Meals List */}
                                                <div className="flex flex-col gap-2 mt-2">
                                                    {order.meals.map((meal: any, mIdx: number) => (
                                                        <div key={mIdx} className="flex items-center gap-3">
                                                            {meal.image_path && (
                                                                <img
                                                                    src={meal.image_path}
                                                                    alt={meal.name}
                                                                    className="w-12 h-12 rounded-md object-cover"
                                                                />
                                                            )}
                                                            <span className="font-medium">{meal.name} ({meal.size})</span>
                                                            <span className="text-xs text-muted-foreground">x{meal.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Deliveries */}
                                                {order.deliveries && order.deliveries.length > 0 && (
                                                    <div className="text-sm bg-muted p-2 rounded mt-2">
                                                        <span className="font-medium">🚚 Jours de livraison: </span>
                                                        {order.deliveries.map((delivery: any, dIdx: number) => {
                                                            const daysMap: Record<number, string> = {
                                                                0: 'Dimanche',
                                                                1: 'Lundi',
                                                                2: 'Mardi',
                                                                3: 'Mercredi',
                                                                4: 'Jeudi',
                                                                5: 'Vendredi',
                                                                6: 'Samedi'
                                                            };
                                                            const deliveryDate = delivery.delivery_window_start
                                                                ? new Date(delivery.delivery_window_start)
                                                                : null;
                                                            const dayOfWeek = deliveryDate ? daysMap[deliveryDate.getDay()] : '-';

                                                            return (
                                                                <Badge key={dIdx} variant="secondary" className="ml-1">
                                                                    {dayOfWeek}
                                                                </Badge>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                                {/* Notes */}
                                                {order.notes && (
                                                    <p className="text-sm bg-muted p-2 rounded">
                                                        📝 {order.notes}
                                                    </p>
                                                )}
                                                {/* Status */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-sm font-medium">Statut commande:</span>
                                                    <Badge className={`capitalize ${statusConfig[order.order_status as keyof typeof statusConfig]?.variant || ''}`}>
                                                        {statusConfig[order.order_status as keyof typeof statusConfig]?.label || order.order_status}
                                                    </Badge>
                                                    <Select
                                                        value={order.order_status}
                                                        onValueChange={async (newStatus) => {
                                                            // Use order_id instead of meal ids
                                                            await onStatusUpdate(String(order.order_id), newStatus);
                                                        }}
                                                    >
                                                        <SelectTrigger className={`w-[120px] ${statusConfig[order.order_status as keyof typeof statusConfig]?.variant || ''} text-white `}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.entries(statusConfig).filter(([key]) => {
                                                                // Filter out Cancelled option if current status is not Pending
                                                                return order.order_status === "Pending" || key !== "Cancelled";
                                                            }).map(([key, value]) => (
                                                                <SelectItem key={key} value={key}>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`w-3 h-3 rounded-full ${value.variant}`}></div>
                                                                        {value.label}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                {/* Total Amount */}
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Montant total: {order.total_amount} €
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
