import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, GripVertical, Star, Loader2 } from "lucide-react";
import { webRoutes } from "@/routes/web";
import { MenuMeal } from "@/interfaces/admin";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function EditWeeklyMenu() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        week_start_date: "",
        week_end_date: "",
        is_active: true,
        is_published: false,
    });

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMenu, setLoadingMenu] = useState(true);
    const [selectedMeals, setSelectedMeals] = useState<MenuMeal[]>([]);
    const [mealSelectionOpen, setMealSelectionOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (id) {
            fetchWeeklyMenu();
        }
    }, [id]);

    const fetchWeeklyMenu = () => {
        setLoadingMenu(true);
        http.get(`${apiRoutes.weeklyMenus}/${id}`)
            .then((res) => {
                const menu = res.data.data;
                setFormData({
                    title: menu.title || "",
                    description: menu.description || "",
                    week_start_date: menu.week_start_date?.split('T')[0] || "",
                    week_end_date: menu.week_end_date?.split('T')[0] || "",
                    is_active: menu.is_active !== undefined ? menu.is_active : true,
                    is_published: menu.is_published !== undefined ? menu.is_published : false,
                });

                if (menu.meals && Array.isArray(menu.meals)) {
                    setSelectedMeals(menu.meals);
                }

                setLoadingMenu(false);
            })
            .catch((error) => {
                console.error("Error fetching weekly menu:", error);
                setLoadingMenu(false);
            });
    };



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    // const handleAddMeal = (meal: Meal) => {
    //     const exists = selectedMeals.find(m => m.meal_id === meal.id);
    //     if (!exists) {
    //         const newMenuMeal: MenuMeal = {
    //             weekly_menu_id: parseInt(id || "0"),
    //             meal_id: meal.id,
    //             position: selectedMeals.length + 1,
    //             is_featured: false,
    //             special_price: null,
    //             availability_count: 50,
    //             sold_count: 0,
    //             meal: meal
    //         };
    //         setSelectedMeals([...selectedMeals, newMenuMeal]);
    //     }
    // };

    const handleRemoveMeal = (mealId: number) => {
        setSelectedMeals(selectedMeals.filter(m => m.meal_id !== mealId));
    };

    const handleToggleFeatured = (mealId: number) => {
        setSelectedMeals(selectedMeals.map(m =>
            m.meal_id === mealId ? { ...m, is_featured: !m.is_featured } : m
        ));
    };

    const handleSpecialPriceChange = (mealId: number, price: string) => {
        const numericPrice = price === "" ? null : parseFloat(price);
        setSelectedMeals(selectedMeals.map(m =>
            m.meal_id === mealId ? { ...m, special_price: numericPrice } : m
        ));
    };

    const handleAvailabilityChange = (mealId: number, count: string) => {
        const numericCount = parseInt(count) || 0;
        setSelectedMeals(selectedMeals.map(m =>
            m.meal_id === mealId ? { ...m, availability_count: numericCount } : m
        ));
    };

    const handleSubmit = () => {
        setError(false);
        setSuccess(false);
        setLoading(true);

        if (formData.title && formData.week_start_date && formData.week_end_date) {
            const submitData = {
                ...formData,
                meals: selectedMeals.map(m => ({
                    meal_id: m.meal_id,
                    position: m.position,
                    is_featured: m.is_featured,
                    special_price: m.special_price,
                    availability_count: m.availability_count
                }))
            };

            http.put(`${apiRoutes.weeklyMenus}/${id}`, submitData)
                .then(() => {
                    setSuccess(true);
                    setTimeout(() => {
                        navigate(webRoutes.dashboard_weekly_menus);
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

    // const filteredMeals = []; // Removed availableMeals state and related code

    if (loadingMenu) {
        return (
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(webRoutes.dashboard_weekly_menus)}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Modifier le menu hebdomadaire</h1>
                            <p className="text-muted-foreground">Mettez à jour les informations du menu</p>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => navigate(webRoutes.dashboard_weekly_menus)}
                        >
                            Annuler
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </div>
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        Veuillez remplir tous les champs obligatoires (titre, dates de début et fin)
                    </AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 border-green-500 text-green-700">
                    <AlertTitle>Succès</AlertTitle>
                    <AlertDescription>
                        Le menu hebdomadaire a été mis à jour avec succès. Redirection en cours...
                    </AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Détails du menu</TabsTrigger>
                    <TabsTrigger value="meals">
                        Repas ({selectedMeals.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations du menu</CardTitle>
                            <CardDescription>Définissez les détails de votre menu hebdomadaire</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Label>Titre du menu *</Label>
                                    <Input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Menu de la semaine du 7 au 13 octobre"
                                    />
                                </div>

                                <div>
                                    <Label>Date de début *</Label>
                                    <Input
                                        type="date"
                                        name="week_start_date"
                                        value={formData.week_start_date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label>Date de fin *</Label>
                                    <Input
                                        type="date"
                                        name="week_end_date"
                                        value={formData.week_end_date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Décrivez le menu de la semaine..."
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-4">Paramètres</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Menu actif</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Le menu sera visible et utilisable
                                            </p>
                                        </div>
                                        <Switch
                                            checked={formData.is_active}
                                            onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Menu publié</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Le menu sera visible pour les clients
                                            </p>
                                        </div>
                                        <Switch
                                            checked={formData.is_published}
                                            onCheckedChange={(checked) => handleSwitchChange("is_published", checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="meals" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Gestion des repas</CardTitle>
                                    <CardDescription>
                                        Ajoutez et configurez les repas pour ce menu
                                    </CardDescription>
                                </div>
                                <Dialog open={mealSelectionOpen} onOpenChange={setMealSelectionOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Ajouter des repas
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Sélectionner des repas</DialogTitle>
                                            <DialogDescription>
                                                Choisissez les repas à ajouter au menu hebdomadaire
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <Input
                                                placeholder="Rechercher un repas..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* {filteredMeals.map((meal) => (
                                                    <Card
                                                        key={meal.id}
                                                        className="cursor-pointer hover:border-primary transition-colors"
                                                        onClick={() => {
                                                            handleAddMeal(meal);
                                                            setMealSelectionOpen(false);
                                                        }}
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="flex gap-3">
                                                                {meal.image_path && (
                                                                    <img
                                                                        src={meal.image_path}
                                                                        alt={meal.name}
                                                                        className="w-20 h-20 object-cover rounded"
                                                                    />
                                                                )}
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold">{meal.name}</h4>
                                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                                        {meal.short_description || meal.description}
                                                                    </p>
                                                                    <p className="text-sm font-medium mt-2">
                                                                        {meal.price} MAD
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))} */}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {selectedMeals.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>Aucun repas sélectionné</p>
                                    <p className="text-sm">Cliquez sur "Ajouter des repas" pour commencer</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedMeals.map((menuMeal, index) => (
                                        <Card key={menuMeal.meal_id}>
                                            <CardContent className="p-4">
                                                <div className="flex gap-4 items-start">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                                                        <span className="text-sm font-medium text-muted-foreground">
                                                            #{index + 1}
                                                        </span>
                                                    </div>

                                                    {menuMeal.meal?.image_path && (
                                                        <img
                                                            src={menuMeal.meal.image_path}
                                                            alt={menuMeal.meal.name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    )}

                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h4 className="font-semibold flex items-center gap-2">
                                                                    {menuMeal.meal?.name}
                                                                    {menuMeal.is_featured && (
                                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                    )}
                                                                </h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Prix original: {menuMeal.meal?.price} MAD
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant={menuMeal.is_featured ? "default" : "outline"}
                                                                    onClick={() => handleToggleFeatured(menuMeal.meal_id)}
                                                                >
                                                                    <Star className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleRemoveMeal(menuMeal.meal_id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <Label className="text-xs">Prix spécial (optionnel)</Label>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={menuMeal.special_price || ""}
                                                                    onChange={(e) => handleSpecialPriceChange(menuMeal.meal_id, e.target.value)}
                                                                    placeholder={`${menuMeal.meal?.price} MAD`}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">Quantité disponible</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={menuMeal.availability_count || 0}
                                                                    onChange={(e) => handleAvailabilityChange(menuMeal.meal_id, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        {menuMeal.sold_count !== undefined && (
                                                            <div className="text-xs text-muted-foreground">
                                                                Vendus: {menuMeal.sold_count} / {menuMeal.availability_count}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
