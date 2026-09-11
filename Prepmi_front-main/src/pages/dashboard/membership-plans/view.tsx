import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { webRoutes } from "@/routes/web";
import { MembershipPlan } from "@/interfaces/admin";
import { Badge } from "@/components/ui/badge";

const DetailItem = ({ label, value }: any) => (
    <div>
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p>{value !== null && value !== undefined ? value : "-"}</p>
    </div>
);

export default function MembershipPlanDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [plan, setPlan] = useState<MembershipPlan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            http.get(`${apiRoutes.membershipPlans}/${id}`)
                .then((res) => {
                    setPlan(res.data);
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
                    <p className="text-muted-foreground">Chargement des détails du plan d'adhésion...</p>
                </div>
            </div>
        );
    }

    if (!plan) {
        return <div>Plan d'adhésion non trouvé.</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate(webRoutes.dashboard_membership_plans)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <h1 className="text-3xl font-bold">{plan.name}</h1>
            </div>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Nom" value={plan.name} />
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground">Statut</p>
                            <Badge className={plan.is_active ? "bg-green-500" : "bg-red-500"}>
                                {plan.is_active ? "Actif" : "Inactif"}
                            </Badge>
                        </div>
                        <div className="col-span-2">
                            <DetailItem label="Description" value={plan.description || "-"} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Avantages supplémentaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground">Livraison gratuite</p>
                            <Badge className={plan.free_delivery ? "bg-green-500" : "bg-red-500"}>
                                {plan.free_delivery ? "Oui" : "Non"}
                            </Badge>
                        </div>
                        <DetailItem label="Remise fixe" value={plan.fixed_discount_amount ? `${plan.fixed_discount_amount} MAD` : "-"} />
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground">Accès premium</p>
                            <Badge className={plan.has_premium_access ? "bg-green-500" : "bg-red-500"}>
                                {plan.has_premium_access ? "Oui" : "Non"}
                            </Badge>
                        </div>
                        <DetailItem label="Frais upgrade minimum" value={plan.premium_upgrade_fee_min ? `${plan.premium_upgrade_fee_min} MAD` : "-"} />
                        <DetailItem label="Frais upgrade maximum" value={plan.premium_upgrade_fee_max ? `${plan.premium_upgrade_fee_max} MAD` : "-"} />
                        <DetailItem label="Congélations gratuites par période" value={plan.free_freezes_per_period || 0} />
                        <DetailItem label="Période de congélation" value={plan.freeze_period_months ? `${plan.freeze_period_months} mois` : "-"} />
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground">Annulable à tout moment</p>
                            <Badge className={plan.cancellable_anytime ? "bg-green-500" : "bg-red-500"}>
                                {plan.cancellable_anytime ? "Oui" : "Non"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
                <Button
                    variant="outline"
                    onClick={() => navigate(webRoutes.dashboard_membership_plans_edit.replace(':id', String(plan.id)))}
                >
                    Modifier
                </Button>
            </div>
        </div>
    );
}
