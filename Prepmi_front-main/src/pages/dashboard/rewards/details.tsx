import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { webRoutes } from "@/routes/web";
// Reward interface for details
interface Reward {
    id: string;
    type: string;
    value: number;
    title: string;
    description: string;
    is_used: boolean;
    earned_at: string;
    expires_at: string;
    used_at?: string;
    used_order_id?: string;
    discount_applied?: boolean;
    conditions?: string;
}
import { Badge } from "@/components/ui/badge";

const DetailItem = ({ label, value }: { label: string; value: any }) => (
    <div>
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p>{value || "-"}</p>
    </div>
);

export default function RewardDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [reward, setReward] = useState<Reward | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            http.get(`${apiRoutes.rewards}/${id}`)
                .then((res) => {
                    setReward(res.data.data);
                })
                .catch(handleErrorResponse)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return <div className="container mx-auto p-6">Chargement des détails de la récompense...</div>;
    }

    if (!reward) {
        return <div className="container mx-auto p-6">Récompense non trouvée.</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate(webRoutes.dashboard_rewards)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <h1 className="text-3xl font-bold">{reward.title}</h1>
                <Badge className={reward.is_used ? "bg-yellow-500" : "bg-green-500"}>
                    {reward.is_used ? "Utilisé" : "Disponible"}
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations de la récompense</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Type" value={reward.type} />
                        <DetailItem label="Valeur" value={reward.value} />
                        <DetailItem label="Titre" value={reward.title} />
                        <DetailItem label="Description" value={reward.description} />
                        <DetailItem label="Obtenu le" value={reward.earned_at ? new Date(reward.earned_at).toLocaleString() : "-"} />
                        <DetailItem label="Expire le" value={reward.expires_at ? new Date(reward.expires_at).toLocaleString() : "-"} />
                        <DetailItem label="Utilisé le" value={reward.used_at ? new Date(reward.used_at).toLocaleString() : "-"} />
                        <DetailItem label="Commande utilisée" value={reward.used_order_id || "-"} />
                        <DetailItem label="Remise appliquée" value={reward.discount_applied ? "Oui" : "Non"} />
                        <DetailItem label="Conditions" value={reward.conditions || "-"} />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/dashboard/rewards/edit/${reward.id}`)}
                        >
                            Modifier
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
