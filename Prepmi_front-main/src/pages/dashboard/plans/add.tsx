import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { webRoutes } from "@/routes/web";

export default function AddPlan() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        meals_per_week: 0,
        price_per_week: 0,
        is_active: true,
        points_value: 0,
        delivery_fee: 0,
        is_free_shipping: false,
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
        if (formData.name && formData.price_per_week > 0) {
            const submitData = new FormData();

            Object.keys(formData).forEach((key) => {
                const value = formData[key as keyof typeof formData];
                if (typeof value === 'boolean') {
                    submitData.append(key, value ? '1' : '0');
                } else if (value !== null && value !== undefined) {
                    submitData.append(key, String(value));
                }
            });

            http.post(apiRoutes.plans, submitData)
                .then(() => {
                    setSuccess(true);
                    setTimeout(() => {
                        navigate(webRoutes.dashboard_plans);
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
                            onClick={() => navigate(webRoutes.dashboard_plans)}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Button>
                        <h1 className="text-3xl font-bold">Ajouter un plan</h1>
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
                        Veuillez remplir tous les champs obligatoires (nom, prix).
                    </AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 border-green-500 text-green-700">
                    <AlertTitle>Succès</AlertTitle>
                    <AlertDescription>
                        Le plan a été ajouté avec succès. Redirection en cours...
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Détails du plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Nom du plan *</Label>
                            <Input name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Repas par semaine</Label>
                            <Input type="number" name="meals_per_week" value={formData.meals_per_week} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Prix par semaine *</Label>
                            <Input type="number" name="price_per_week" value={formData.price_per_week} onChange={handleChange} step="0.01" />
                        </div>
                        <div>
                            <Label>Valeur en points</Label>
                            <Input type="number" name="points_value" value={formData.points_value} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Frais de livraison</Label>
                            <Input type="number" name="delivery_fee" value={formData.delivery_fee} onChange={handleChange} step="0.01" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_free_shipping"
                            checked={formData.is_free_shipping}
                            onCheckedChange={(checked) => handleSwitchChange("is_free_shipping", checked)}
                        />
                        <Label htmlFor="is_free_shipping">Livraison gratuite</Label>
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
