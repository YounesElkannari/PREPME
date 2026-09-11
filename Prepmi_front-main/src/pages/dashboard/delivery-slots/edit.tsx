import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { webRoutes } from "@/routes/web";

export default function EditDeliverySlot() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        slot_name: "",
        slot_type: "normal",
        start_time: "",
        end_time: "",
        max_capacity: 0,
        current_bookings: 0,
        day_of_week: "",
        is_active: true,
        price_adjustment: 0,
        description: "",
    });

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingSlot, setLoadingSlot] = useState(true);

    useEffect(() => {
        if (id) {
            setLoadingSlot(true);
            http.get(`${apiRoutes.deliverySlots}/${id}`)
                .then((res) => {
                    const slot = res.data.data;

                    // Convert day_of_week from integer to string or handle null
                    let dayOfWeek = slot.day_of_week;
                    if (dayOfWeek !== null && dayOfWeek !== undefined) {
                        dayOfWeek = String(dayOfWeek);
                    } else {
                        dayOfWeek = 'all';
                    }

                    // Strip seconds from time if present
                    let startTime = slot.start_time || "";
                    let endTime = slot.end_time || "";
                    if (startTime && startTime.split(':').length === 3) {
                        startTime = startTime.substring(0, 5); // Get HH:mm
                    }
                    if (endTime && endTime.split(':').length === 3) {
                        endTime = endTime.substring(0, 5); // Get HH:mm
                    }

                    setFormData({
                        slot_name: slot.slot_name || "",
                        slot_type: slot.slot_type || "morning",
                        start_time: startTime,
                        end_time: endTime,
                        max_capacity: slot.max_capacity || 0,
                        current_bookings: slot.current_bookings || 0,
                        day_of_week: dayOfWeek,
                        is_active: slot.is_active !== undefined ? slot.is_active : true,
                        price_adjustment: slot.price_adjustment || 0,
                        description: slot.description || "",
                    });
                })
                .catch((e) => {
                    handleErrorResponse(e);
                    setError(true);
                })
                .finally(() => {
                    setLoadingSlot(false);
                });
        }
    }, [id]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = () => {
        setError(false);
        setSuccess(false);
        setLoading(true);
        if (formData.slot_name && formData.start_time && formData.end_time && id) {
            const submitData = new FormData();

            Object.keys(formData).forEach((key) => {
                let value = formData[key as keyof typeof formData];

                // Convert time format to HH:mm:ss
                if ((key === 'start_time' || key === 'end_time') && value) {
                    // Only add :00 if it's not already in HH:mm:ss format
                    if (typeof value === 'string' && value.split(':').length === 2) {
                        value = value + ':00';
                    }
                }

                // Convert day_of_week to integer or skip if 'all'
                if (key === 'day_of_week') {
                    if (!value || value === 'all') {
                        return; // Don't append if no specific day
                    }
                    const dayMap: Record<string, string> = {
                        'monday': '1',
                        'tuesday': '2',
                        'wednesday': '3',
                        'thursday': '4',
                        'friday': '5',
                        'saturday': '6',
                        'sunday': '0'
                    };
                    value = dayMap[value as string] || value;
                }

                if (typeof value === 'boolean') {
                    submitData.append(key, value ? '1' : '0');
                } else if (value !== null && value !== undefined && value !== '') {
                    submitData.append(key, String(value));
                }
            });

            submitData.append('_method', 'PUT');

            http.post(`${apiRoutes.deliverySlots}/${id}`, submitData)
                .then(() => {
                    setSuccess(true);
                    setTimeout(() => {
                        navigate(webRoutes.dashboard_delivery_slots);
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

    if (loadingSlot) {
        return (
            <div className="container mx-auto p-6 max-w-4xl flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement du créneau...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(webRoutes.dashboard_delivery_slots)}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Button>
                        <h1 className="text-3xl font-bold">Modifier le créneau de livraison</h1>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button onClick={handleSubmit} loading={loading}>
                            Mettre à jour
                        </Button>
                    </div>
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        Veuillez remplir tous les champs obligatoires.
                    </AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 border-green-500 text-green-700">
                    <AlertTitle>Succès</AlertTitle>
                    <AlertDescription>
                        Le créneau a été mis à jour avec succès. Redirection en cours...
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Détails du créneau</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Nom du créneau *</Label>
                            <Input name="slot_name" value={formData.slot_name} onChange={handleChange} placeholder="Ex: Livraison matin" />
                        </div>
                        <div>
                            <Label>Type de créneau</Label>
                            <Select value={formData.slot_type} onValueChange={(value) => handleSelectChange("slot_type", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner le type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="membership">Membership</SelectItem>
                                    <SelectItem value="both">Les deux</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Heure de début *</Label>
                            <Input type="time" name="start_time" value={formData.start_time} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Heure de fin *</Label>
                            <Input type="time" name="end_time" value={formData.end_time} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Jour de la semaine</Label>
                            <Select value={formData.day_of_week} onValueChange={(value) => handleSelectChange("day_of_week", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner le jour" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les jours</SelectItem>
                                    <SelectItem value="1">Lundi</SelectItem>
                                    <SelectItem value="2">Mardi</SelectItem>
                                    <SelectItem value="3">Mercredi</SelectItem>
                                    <SelectItem value="4">Jeudi</SelectItem>
                                    <SelectItem value="5">Vendredi</SelectItem>
                                    <SelectItem value="6">Samedi</SelectItem>
                                    <SelectItem value="0">Dimanche</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Capacité maximale *</Label>
                            <Input type="number" name="max_capacity" value={formData.max_capacity} onChange={handleChange} min="1" />
                        </div>
                        <div>
                            <Label>Réservations actuelles</Label>
                            <Input type="number" name="current_bookings" value={formData.current_bookings} onChange={handleChange} min="0" />
                        </div>
                        <div>
                            <Label>Ajustement de prix (MAD)</Label>
                            <Input type="number" name="price_adjustment" value={formData.price_adjustment} onChange={handleChange} step="0.01" placeholder="Ex: 10 ou -5" />
                        </div>
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description du créneau de livraison..."
                            rows={3}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                        />
                        <Label htmlFor="is_active">Créneau actif</Label>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
