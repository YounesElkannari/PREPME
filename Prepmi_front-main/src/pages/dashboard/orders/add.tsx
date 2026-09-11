import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { webRoutes } from "@/routes/web";
import { User, Meal } from "@/interfaces/admin";

export default function AddOrder() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        user_id: "",
        order_date: new Date().toISOString().split('T')[0],
        delivery_date: "",
        status: "pending",
        total_price: 0,
        order_meals: [{ meal_id: "", quantity: 1, price: 0 }],
    });

    const [users, setUsers] = useState<User[]>([]);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch users and meals for dropdowns
        http.get(apiRoutes.users).then((res) => setUsers(res.data.data));
        http.get(apiRoutes.meals).then((res) => setMeals(res.data.data));
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMealChange = (index: number, field: string, value: any) => {
        const newOrderMeals: any = [...formData.order_meals];
        newOrderMeals[index][field] = value;

        if (field === 'meal_id') {
            const selectedMeal = meals.find(m => m.id === parseInt(value));
            newOrderMeals[index]['price'] = selectedMeal?.price || 0;
        }

        const totalPrice = newOrderMeals.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        setFormData(prev => ({ ...prev, order_meals: newOrderMeals, total_price: totalPrice }));
    };

    const addMeal = () => {
        setFormData(prev => ({
            ...prev,
            order_meals: [...prev.order_meals, { meal_id: "", quantity: 1, price: 0 }]
        }));
    };

    const removeMeal = (index: number) => {
        const newOrderMeals = formData.order_meals.filter((_, i) => i !== index);
        const totalPrice = newOrderMeals.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        setFormData(prev => ({ ...prev, order_meals: newOrderMeals, total_price: totalPrice }));
    };

    const handleSubmit = () => {
        setError(false);
        setSuccess(false);
        setLoading(true);

        if (formData.user_id && formData.order_meals.length > 0) {
            http.post(apiRoutes.orders, formData)
                .then(() => {
                    setSuccess(true);
                    setTimeout(() => navigate(webRoutes.dashboard_orders), 2000);
                })
                .catch((e) => {
                    handleErrorResponse(e);
                    setError(true);
                })
                .finally(() => setLoading(false));
        } else {
            setError(true);
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate(webRoutes.dashboard_orders)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <h1 className="text-3xl font-bold">Ajouter une commande</h1>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>Veuillez remplir tous les champs obligatoires.</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 border-green-500 text-green-700">
                    <AlertTitle>Succès</AlertTitle>
                    <AlertDescription>La commande a été ajoutée. Redirection...</AlertDescription>
                </Alert>
            )}

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Détails de la commande</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Client</Label>
                            <Select onValueChange={(value) => handleSelectChange("user_id", value)}>
                                <SelectTrigger><SelectValue placeholder="Sélectionner un client" /></SelectTrigger>
                                <SelectContent>
                                    {users.map(user => <SelectItem key={user.id} value={String(user.id)}>{user.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Statut</Label>
                            <Select onValueChange={(value) => handleSelectChange("status", value)} defaultValue={formData.status}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">En attente</SelectItem>
                                    <SelectItem value="preparing">En préparation</SelectItem>
                                    <SelectItem value="shipped">Expédiée</SelectItem>
                                    <SelectItem value="delivered">Livrée</SelectItem>
                                    <SelectItem value="cancelled">Annulée</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Date de commande</Label>
                            <Input type="date" name="order_date" value={formData.order_date} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Date de livraison</Label>
                            <Input type="date" name="delivery_date" value={formData.delivery_date} onChange={handleChange} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Repas commandés</CardTitle>
                        <CardDescription>Ajouter des repas à la commande</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {formData.order_meals.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="flex-1">
                                    <Label>Repas</Label>
                                    <Select onValueChange={(value) => handleMealChange(index, 'meal_id', value)}>
                                        <SelectTrigger><SelectValue placeholder="Sélectionner un repas" /></SelectTrigger>
                                        <SelectContent>
                                            {meals.map(meal => <SelectItem key={meal.id} value={String(meal.id)}>{meal.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Quantité</Label>
                                    <Input type="number" value={item.quantity} onChange={(e) => handleMealChange(index, 'quantity', parseInt(e.target.value))} min="1" className="w-24" />
                                </div>
                                <div>
                                    <Label>Prix</Label>
                                    <Input type="number" value={item.price} readOnly className="w-24 bg-gray-100" />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeMeal(index)} className="self-end">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={addMeal}><PlusCircle className="w-4 h-4 mr-2" />Ajouter un repas</Button>
                    </CardContent>
                </Card>

                <div className="flex justify-between items-center pt-4">
                    <div className="text-2xl font-bold">
                        Total: {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "MAD" }).format(formData.total_price)}
                    </div>
                    <Button onClick={handleSubmit} loading={loading} size="lg">
                        Créer la commande
                    </Button>
                </div>
            </div>
        </div>
    );
}
