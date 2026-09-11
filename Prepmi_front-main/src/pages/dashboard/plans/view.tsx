import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { webRoutes } from "@/routes/web";
import { Plan } from "@/interfaces/admin";
import { Badge } from "@/components/ui/badge";

const DetailItem = ({ label, value }: any) => (
    <div>
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p>{value !== null && value !== undefined ? value : "-"}</p>
    </div>
);

export default function PlanDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [plan, setPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            http.get(`${apiRoutes.plans}/${id}`)
                .then((res) => {
                    setPlan(res.data.data);
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
                    <p className="text-muted-foreground">Chargement des détails du plan...</p>
                </div>
            </div>
        );
    }

    if (!plan) {
        return <div>Plan non trouvé.</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate(webRoutes.dashboard_plans)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <h1 className="text-3xl font-bold">{plan.name}</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Détails du plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Repas par semaine" value={plan.meals_per_week} />
                        <DetailItem label="Prix par semaine" value={`${plan.price_per_week} MAD`} />
                        <DetailItem label="Valeur en points" value={plan.points_value} />
                        <DetailItem
                            label="Frais de livraison"
                            value={plan.is_free_shipping ? <Badge variant="secondary">Gratuite</Badge> : `${plan.delivery_fee} MAD`}
                        />
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground">Statut</p>
                            <Badge className={plan.is_active ? "bg-green-500" : "bg-red-500"}>
                                {plan.is_active ? "Actif" : "Inactif"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
