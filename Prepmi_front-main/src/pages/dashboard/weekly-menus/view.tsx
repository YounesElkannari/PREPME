import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Edit, Loader2, Star } from "lucide-react";
import { webRoutes } from "@/routes/web";
import { Badge } from "@/components/ui/badge";
import { WeeklyMenu } from "@/interfaces/admin";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";

export default function ViewWeeklyMenu() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [menu, setMenu] = useState<WeeklyMenu | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchWeeklyMenu();
        }
    }, [id]);

    const fetchWeeklyMenu = () => {
        setLoading(true);
        http.get(`${apiRoutes.weeklyMenus}/${id}`)
            .then((res) => {
                setMenu(res.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching weekly menu:", error);
                setLoading(false);
            });
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </div>
        );
    }

    if (!menu) {
        return (
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Menu introuvable</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate(webRoutes.dashboard_weekly_menus)}
                    >
                        Retour à la liste
                    </Button>
                </div>
            </div>
        );
    }

    const totalMeals = menu.meals?.length || 0;
    const featuredMeals = menu.meals?.filter(m => m.is_featured).length || 0;
    const totalAvailability = menu.meals?.reduce((sum, m) => sum + (m.availability_count || 0), 0) || 0;
    const totalSold = menu.meals?.reduce((sum, m) => sum + (m.sold_count || 0), 0) || 0;
    const soldPercentage = totalAvailability > 0 ? (totalSold / totalAvailability) * 100 : 0;

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
                            <h1 className="text-3xl font-bold">{menu.title}</h1>
                            <p className="text-muted-foreground mt-1">
                                {menu.week_start_date && menu.week_end_date && (
                                    <>
                                        <Calendar className="inline w-4 h-4 mr-1" />
                                        {format(new Date(menu.week_start_date), "dd MMM", { locale: fr })} - {format(new Date(menu.week_end_date), "dd MMM yyyy", { locale: fr })}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => navigate(webRoutes.dashboard_weekly_menus_edit.replace(':id', id || ''))}>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Status and Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Statut</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                {menu.is_published ? (
                                    <Badge variant="default" className="bg-green-500 w-fit">Publié</Badge>
                                ) : (
                                    <Badge variant="outline" className="w-fit">Brouillon</Badge>
                                )}
                                {menu.is_active && (
                                    <Badge variant="secondary" className="w-fit">Actif</Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Repas totaux</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalMeals}</div>
                            <p className="text-xs text-muted-foreground">
                                {featuredMeals} en vedette
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Disponibilité</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalAvailability}</div>
                            <p className="text-xs text-muted-foreground">
                                portions disponibles
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Ventes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalSold}</div>
                            <Progress value={soldPercentage} className="mt-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                                {soldPercentage.toFixed(1)}% vendus
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Description */}
                {menu.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{menu.description}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Meals List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Repas du menu ({totalMeals})</CardTitle>
                        <CardDescription>Liste des repas inclus dans ce menu hebdomadaire</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {menu.meals && menu.meals.length > 0 ? (
                            <div className="space-y-4">
                                {menu.meals.map((menuMeal, index) => {
                                    const availability = menuMeal.availability_count || 0;
                                    const sold = menuMeal.sold_count || 0;
                                    const remaining = availability - sold;
                                    const soldPercent = availability > 0 ? (sold / availability) * 100 : 0;
                                    const effectivePrice = menuMeal.special_price || menuMeal.meal?.price;

                                    return (
                                        <Card key={menuMeal.meal_id || index}>
                                            <CardContent className="p-4">
                                                <div className="flex gap-4 items-start">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground">
                                                            #{index + 1}
                                                        </span>
                                                    </div>

                                                    {menuMeal.meal?.image_path && (
                                                        <img
                                                            src={menuMeal.meal.image_path}
                                                            alt={menuMeal.meal.name}
                                                            className="w-24 h-24 object-cover rounded-lg"
                                                        />
                                                    )}

                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                                                    {menuMeal.meal?.name}
                                                                    {menuMeal.is_featured && (
                                                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                                    )}
                                                                </h4>
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    {menuMeal.meal?.short_description || menuMeal.meal?.description}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Prix</p>
                                                                <p className="font-semibold">
                                                                    {effectivePrice} MAD
                                                                    {menuMeal.special_price && (
                                                                        <span className="text-xs text-muted-foreground line-through ml-2">
                                                                            {menuMeal.meal?.price} MAD
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Disponibles</p>
                                                                <p className="font-semibold">{availability}</p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Vendus</p>
                                                                <p className="font-semibold">{sold}</p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Restants</p>
                                                                <p className="font-semibold">{remaining}</p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3">
                                                            <div className="flex items-center justify-between text-xs mb-1">
                                                                <span className="text-muted-foreground">Progression des ventes</span>
                                                                <span className="font-medium">{soldPercent.toFixed(1)}%</span>
                                                            </div>
                                                            <Progress value={soldPercent} />
                                                        </div>

                                                        <div className="flex gap-2 mt-3">
                                                            {menuMeal.is_featured && (
                                                                <Badge variant="default">En vedette</Badge>
                                                            )}
                                                            {menuMeal.special_price && (
                                                                <Badge variant="secondary">Prix spécial</Badge>
                                                            )}
                                                            {remaining === 0 && (
                                                                <Badge variant="destructive">Épuisé</Badge>
                                                            )}
                                                            {remaining > 0 && remaining < 10 && (
                                                                <Badge variant="outline" className="border-orange-500 text-orange-500">
                                                                    Stock faible
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                Aucun repas ajouté à ce menu
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Meta Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations supplémentaires</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Date de publication</p>
                                <p className="font-medium">
                                    {menu.published_at
                                        ? format(new Date(menu.published_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })
                                        : "Non publié"
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Créé le</p>
                                <p className="font-medium">
                                    {menu.created_at
                                        ? format(new Date(menu.created_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })
                                        : "-"
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Dernière modification</p>
                                <p className="font-medium">
                                    {menu.updated_at
                                        ? format(new Date(menu.updated_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })
                                        : "-"
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
