import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { webRoutes } from "@/routes/web";
import { DeliverySlot } from "@/interfaces/admin";
import { Badge } from "@/components/ui/badge";

const DetailItem = ({ label, value }: any) => (
    <div>
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p>{value !== null && value !== undefined ? value : "-"}</p>
    </div>
);

export default function DeliverySlotDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [slot, setSlot] = useState<DeliverySlot | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            http.get(`${apiRoutes.deliverySlots}/${id}`)
                .then((res) => {
                    setSlot(res.data.data);
                })
                .catch(handleErrorResponse)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-4xl flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement des détails du créneau...</p>
                </div>
            </div>
        );
    }

    if (!slot) {
        return <div>Créneau non trouvé.</div>;
    }

    const daysMap: Record<number, string> = {
        0: 'Dimanche',
        1: 'Lundi',
        2: 'Mardi',
        3: 'Mercredi',
        4: 'Jeudi',
        5: 'Vendredi',
        6: 'Samedi'
    };

    const slotTypesMap: Record<string, string> = {
        'normal': 'Normal',
        'membership': 'Membership',
        'both': 'Les deux'
    };

    const bookingPercentage = slot.max_capacity > 0
        ? ((slot.current_bookings || 0) / slot.max_capacity * 100).toFixed(0)
        : 0;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate(webRoutes.dashboard_delivery_slots)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <h1 className="text-3xl font-bold">{slot.slot_name}</h1>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations générales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Nom du créneau" value={slot.slot_name} />
                            <DetailItem
                                label="Type"
                                value={<Badge variant="outline">{slotTypesMap[slot.slot_type] || slot.slot_type}</Badge>}
                            />
                            <DetailItem label="Heure de début" value={slot.start_time} />
                            <DetailItem label="Heure de fin" value={slot.end_time} />
                            <DetailItem
                                label="Jour de la semaine"
                                value={slot.day_of_week !== null && slot.day_of_week !== undefined ? daysMap[Number(slot.day_of_week)] || String(slot.day_of_week) : "Tous les jours"}
                            />
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground">Statut</p>
                                <Badge className={slot.is_active ? "bg-green-500" : "bg-red-500"}>
                                    {slot.is_active ? "Actif" : "Inactif"}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Capacité et réservations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Capacité maximale" value={slot.max_capacity} />
                            <DetailItem label="Réservations actuelles" value={slot.current_bookings || 0} />
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground">Taux de remplissage</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${Number(bookingPercentage) >= 80 ? 'bg-red-500' :
                                                Number(bookingPercentage) >= 50 ? 'bg-yellow-500' :
                                                    'bg-green-500'
                                                }`}
                                            style={{ width: `${bookingPercentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium">{bookingPercentage}%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Prix et description</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem
                                label="Ajustement de prix"
                                value={
                                    slot.price_adjustment
                                        ? new Intl.NumberFormat("fr-FR", {
                                            style: "currency",
                                            currency: "MAD",
                                            signDisplay: "always"
                                        }).format(slot.price_adjustment)
                                        : "Aucun"
                                }
                            />
                        </div>
                        {slot.description && (
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-2">Description</p>
                                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                    {slot.description}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
