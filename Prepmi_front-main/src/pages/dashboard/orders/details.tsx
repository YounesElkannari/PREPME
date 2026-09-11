import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { webRoutes } from "@/routes/web";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusVariant: any = {
    pending: "bg-yellow-500",
    preparing: "bg-blue-500",
    shipped: "bg-indigo-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
};

export default function OrderDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState<any | null>(null); // Use 'any' for flexibility
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            http.get(`${apiRoutes.orders}/${id}`)
                .then((res) => {
                    setOrder(res.data.data);
                    console.log(res.data.data);
                })
                .catch(handleErrorResponse)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return <div>Chargement des détails de la commande...</div>;
    }

    if (!order) {
        return <div>Commande non trouvée.</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate(webRoutes.dashboard_orders)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <h1 className="text-3xl font-bold">Détails de la commande #{order.num_order}</h1>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations générales</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">Nom du client</p>
                            <p>{order?.first_name} {order?.last_name}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Téléphone</p>
                            <p>{order?.phone}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Adresse de livraison</p>
                            <p>{order?.adresse_livraison}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Méthode de paiement</p>
                            <p>{order?.method_payement}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Points de fidélité</p>
                            <p>{order?.reward_point}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Date de commande</p>
                            <p>{order?.date_order ? new Date(order?.date_order).toLocaleDateString('fr-FR') : '-'}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Statut</p>
                            <Badge className={`capitalize ${statusVariant[order?.statue] || "bg-gray-500"}`}>
                                {order?.statue}
                            </Badge>
                        </div>
                        <div>
                            <p className="font-semibold">Prix Total</p>
                            <p className="font-bold text-lg">{order.total_amount} MAD</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Repas commandés</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Repas</TableHead>
                                    <TableHead>Quantité</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.order_meals && order.order_meals.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.meal?.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>


                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {order.deliveries && order.deliveries.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Livraisons</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Jour</TableHead>
                                        <TableHead>Date et heure</TableHead>
                                        <TableHead>Créneau</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.deliveries.map((delivery: any) => {
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
                                            <TableRow key={delivery.id}>
                                                <TableCell>
                                                    <div className="font-medium">{dayOfWeek}</div>
                                                    {delivery.delivery_slot?.day_of_week !== null && (
                                                        <div className="text-xs text-muted-foreground">
                                                            Créneau: {daysMap[delivery.delivery_slot.day_of_week] || 'Tous les jours'}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {deliveryDate ? (
                                                        <div>
                                                            <div>{deliveryDate.toLocaleDateString('fr-FR')}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {deliveryDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                                {delivery.delivery_window_end && (
                                                                    <> - {new Date(delivery.delivery_window_end).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {delivery.delivery_slot ? (
                                                        <div>
                                                            <div className="font-medium">{delivery.delivery_slot.slot_name}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {delivery.delivery_slot.start_time?.substring(0, 5)} - {delivery.delivery_slot.end_time?.substring(0, 5)}
                                                            </div>
                                                        </div>
                                                    ) : '-'}
                                                </TableCell>

                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {order.status_histories && order.status_histories.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Historique des statuts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ancien statut</TableHead>
                                        <TableHead>Nouveau statut</TableHead>
                                        <TableHead>Modifié par</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order?.status_histories.map((history: any, idx: number) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <Badge className={`capitalize ${statusVariant[history.old_status] || "bg-gray-500"}`}>
                                                    {history.old_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`capitalize ${statusVariant[history.new_status] || "bg-gray-500"}`}>
                                                    {history.new_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{history.user.first_name} {history.user.last_name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
