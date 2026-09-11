import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { webRoutes } from "@/routes/web";
import { Meal } from "@/interfaces/admin";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DetailItem = ({ label, value }: any) => (
    <div>
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p>{value || "-"}</p>
    </div>
);

const BooleanBadge = ({ value, label }: any) => (
    value ? <Badge>{label}</Badge> : null
);

export default function MealDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [meal, setMeal] = useState<Meal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            http.get(`${apiRoutes.meals}/${id}`)
                .then((res) => {
                    setMeal(res.data.data);
                })
                .catch(handleErrorResponse)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return <div>Chargement des détails du repas...</div>;
    }

    if (!meal) {
        return <div>Repas non trouvé.</div>;
    }

    const dietaryFlags = [
        { key: "is_vegetarian" as const, label: "Végétarien" },
        { key: "is_vegan" as const, label: "Vegan" },
        { key: "is_gluten_free" as const, label: "Sans gluten" },
        { key: "is_dairy_free" as const, label: "Sans lactose" },
        { key: "is_nut_free" as const, label: "Sans noix" },
        { key: "is_keto" as const, label: "Keto" },
        { key: "is_paleo" as const, label: "Paleo" },
        { key: "is_low_carb" as const, label: "Faible en glucides" },
        { key: "is_high_protein" as const, label: "Riche en protéines" },
    ];

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate(webRoutes.dashboard_meals)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <h1 className="text-3xl font-bold">{meal.name}</h1>
            </div>

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Informations</TabsTrigger>
                    <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                    <TabsTrigger value="preparation">Préparation</TabsTrigger>
                    <TabsTrigger value="dietary">Régime</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations de base</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem label="Prix" value={`${meal.price} MAD`} />
                                <DetailItem label="Catégorie" value={meal.category?.name || "-"} />
                                <DetailItem label="Statut" value={meal.is_active ? "Actif" : "Inactif"} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground">Description courte</p>
                                <p>{meal.short_description}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground">Description complète</p>
                                <p>{meal.description}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground">Image</p>
                                <img src={meal.image_url} alt={meal.name} className="w-40 h-40 object-cover rounded-md mt-2" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="nutrition">
                    <Card>
                        <CardHeader><CardTitle>Informations nutritionnelles</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-3 gap-4">
                            <DetailItem label="Calories" value={meal.calories} />
                            <DetailItem label="Protéines (g)" value={meal.protein} />
                            <DetailItem label="Glucides (g)" value={meal.carbohydrates} />
                            <DetailItem label="Lipides (g)" value={meal.fats} />
                            <DetailItem label="Fibres (g)" value={meal.fiber} />
                            <DetailItem label="Sodium (mg)" value={meal.sodium} />
                            <DetailItem label="Sucre (g)" value={meal.sugar} />
                            <DetailItem label="Poids (g)" value={meal.weight_grams} />
                            <DetailItem label="Taille portion" value={meal.serving_size} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="preparation">
                    <Card>
                        <CardHeader><CardTitle>Préparation & Ingrédients</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <DetailItem label="Ingrédients" value={meal.ingredients} />
                            <DetailItem label="Allergènes" value={meal.allergens} />
                            <DetailItem label="Instructions de préparation" value={meal.preparation_instructions} />
                            <DetailItem label="Instructions de conservation" value={meal.storage_instructions} />
                            <div className="grid grid-cols-3 gap-4">
                                <DetailItem label="Temps préparation (min)" value={meal.prep_time_minutes} />
                                <DetailItem label="Temps cuisson (min)" value={meal.cooking_time_minutes} />
                                <DetailItem label="Difficulté" value={meal.difficulty_level} />
                            </div>
                            {meal.is_spicy && <DetailItem label="Niveau épicé" value={meal.spice_level} />}
                            <DetailItem label="Notes du chef" value={meal.chef_notes} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="dietary">
                    <Card>
                        <CardHeader><CardTitle>Restrictions alimentaires</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {dietaryFlags.map(flag => (
                                <BooleanBadge key={flag.key} value={meal[flag.key]} label={flag.label} />
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
