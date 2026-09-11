import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { webRoutes } from "@/routes/web";

export default function AddMembershipPlan() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        monthly_fee: 0,
        discount_percentage: 0,
        delivery_slots: 0,
        includes_free_desserts: false,
        free_desserts_quantity: 0,
        is_active: true,
        billing_day_of_month: 1,
        free_delivery: false,
        fixed_discount_amount: 0,
        has_premium_access: false,
        premium_upgrade_fee_min: 0,
        premium_upgrade_fee_max: 0,
        free_freezes_per_period: 0,
        freeze_period_months: 0,
        cancellable_anytime: false,
    });

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = () => {
        setError(false);
        setSuccess(false);
        setLoading(true);
        if (formData.name && formData.monthly_fee > 0) {
            const submitData = new FormData();

            Object.keys(formData).forEach((key) => {
                const value = formData[key as keyof typeof formData];
                if (typeof value === 'boolean') {
                    submitData.append(key, value ? '1' : '0');
                } else if (value !== null && value !== undefined) {
                    submitData.append(key, String(value));
                }
            });

            http.post(apiRoutes.membershipPlans, submitData)
                .then(() => {
                    setSuccess(true);
                    setTimeout(() => {
                        navigate(webRoutes.dashboard_membership_plans);
                    }, 2000);
                })
                .catch((e) => {
                    handleErrorResponse(e);
                    setError(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setError(true);
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(webRoutes.dashboard_membership_plans)}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Button>
                        <h1 className="text-3xl font-bold">Ajouter un plan d'adhésion</h1>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button onClick={handleSubmit} loading={loading}>
                            Ajouter le plan
                        </Button>
                    </div>
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        Veuillez remplir tous les champs obligatoires (nom, frais mensuels).
                    </AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 border-green-500 text-green-700">
                    <AlertTitle>Succès</AlertTitle>
                    <AlertDescription>
                        Le plan d'adhésion a été ajouté avec succès. Redirection en cours...
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Détails du plan d'adhésion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label>Nom du plan *</Label>
                            <Input name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="col-span-2">
                            <Label>Description</Label>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label>Frais mensuels (MAD) *</Label>
                            <Input
                                type="number"
                                name="monthly_fee"
                                value={formData.monthly_fee}
                                onChange={handleChange}
                                step="0.01"
                            />
                        </div>
                        <div>
                            <Label>Pourcentage de réduction (%)</Label>
                            <Input
                                type="number"
                                name="discount_percentage"
                                value={formData.discount_percentage}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>
                        <div>
                            <Label>Créneaux de livraison</Label>
                            <Input
                                type="number"
                                name="delivery_slots"
                                value={formData.delivery_slots}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                        <div>
                            <Label>Quantité de desserts gratuits</Label>
                            <Input
                                type="number"
                                name="free_desserts_quantity"
                                value={formData.free_desserts_quantity}
                                onChange={handleChange}
                                min="0"
                                disabled={!formData.includes_free_desserts}
                            />
                        </div>
                        <div>
                            <Label>Jour de facturation (1-28)</Label>
                            <Input
                                type="number"
                                name="billing_day_of_month"
                                value={formData.billing_day_of_month}
                                onChange={handleChange}
                                min="1"
                                max="28"
                            />
                        </div>
                        <div>
                            <Label>Montant de réduction fixe (MAD)</Label>
                            <Input
                                type="number"
                                name="fixed_discount_amount"
                                value={formData.fixed_discount_amount}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                            />
                        </div>
                        <div>
                            <Label>Frais de mise à niveau premium min (MAD)</Label>
                            <Input
                                type="number"
                                name="premium_upgrade_fee_min"
                                value={formData.premium_upgrade_fee_min}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                            />
                        </div>
                        <div>
                            <Label>Frais de mise à niveau premium max (MAD)</Label>
                            <Input
                                type="number"
                                name="premium_upgrade_fee_max"
                                value={formData.premium_upgrade_fee_max}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                            />
                        </div>
                        <div>
                            <Label>Nombre de congélations gratuites par période</Label>
                            <Input
                                type="number"
                                name="free_freezes_per_period"
                                value={formData.free_freezes_per_period}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                        <div>
                            <Label>Période de congélation (mois)</Label>
                            <Input
                                type="number"
                                name="freeze_period_months"
                                value={formData.freeze_period_months}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="includes_free_desserts"
                            checked={formData.includes_free_desserts}
                            onCheckedChange={(checked) => handleSwitchChange("includes_free_desserts", checked)}
                        />
                        <Label htmlFor="includes_free_desserts">Inclut des desserts gratuits</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="free_delivery"
                            checked={formData.free_delivery}
                            onCheckedChange={(checked) => handleSwitchChange("free_delivery", checked)}
                        />
                        <Label htmlFor="free_delivery">Livraison gratuite</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="has_premium_access"
                            checked={formData.has_premium_access}
                            onCheckedChange={(checked) => handleSwitchChange("has_premium_access", checked)}
                        />
                        <Label htmlFor="has_premium_access">Accès premium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="cancellable_anytime"
                            checked={formData.cancellable_anytime}
                            onCheckedChange={(checked) => handleSwitchChange("cancellable_anytime", checked)}
                        />
                        <Label htmlFor="cancellable_anytime">Annulable à tout moment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                        />
                        <Label htmlFor="is_active">Actif</Label>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
