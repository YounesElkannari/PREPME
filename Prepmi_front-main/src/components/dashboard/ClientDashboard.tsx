import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, TrendingUp, ShoppingBag, Flame, Sparkles, ChefHat, ArrowRight } from 'lucide-react';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { webRoutes } from "@/routes/web";

interface NutritionSummary {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface MealsHistoryItem {
    meal_name: string;
    quantity: number;
    price: string;
    order_date: string;
}

interface ClientDashboardData {
    nutrition_summary: NutritionSummary;
    orders_this_month: number;
    orders_difference: number;
    meals_history: MealsHistoryItem[];
    order_points_balance: number;
    share_points_balance: number;
    free_meal_credits: number;
    order_points_threshold: number;
    share_points_threshold: number;
}

export default function ClientDashboard() {
    const [data, setData] = useState<ClientDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state: RootState) => state.admin?.user);
    const navigate = useNavigate();

    useEffect(() => {
        http.get(apiRoutes.dashboard).then((res) => {
            setData(res.data);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-96 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                <p className="text-muted-foreground font-medium animate-pulse">Préparation de votre espace gourmand...</p>
            </div>
        );
    }

    if (!data) {
        return <div className="flex justify-center items-center h-96 text-muted-foreground">Aucune donnée disponible pour le moment.</div>;
    }

    const totalCalories = data.nutrition_summary?.calories ?? 0;
    const protein = data.nutrition_summary?.protein ?? 0;
    const carbs = data.nutrition_summary?.carbs ?? 0;
    const fat = data.nutrition_summary?.fat ?? 0;

    // Calculs des calories par macronutriment (1g de protéines = 4kcal, 1g de glucides = 4kcal, 1g de lipides = 9kcal)
    const proteinCalories = protein * 4;
    const carbsCalories = carbs * 4;
    const fatCalories = fat * 9;
    const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;

    const proteinPercentage = totalMacroCalories > 0 ? (proteinCalories / totalMacroCalories) * 100 : 0;
    const carbsPercentage = totalMacroCalories > 0 ? (carbsCalories / totalMacroCalories) * 100 : 0;
    const fatPercentage = totalMacroCalories > 0 ? (fatCalories / totalMacroCalories) * 100 : 0;

    // SVG donut chart values
    const radius = 65;
    const circumference = 2 * Math.PI * radius;
    const carbsOffset = (proteinPercentage / 100) * circumference;
    const fatOffset = ((proteinPercentage + carbsPercentage) / 100) * circumference;

    const fullName = user?.first_name && user?.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : "Gourmet";

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Banner Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-zinc-900 text-white p-8 shadow-xl">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/50 border border-emerald-600/50 text-emerald-200 text-xs font-medium tracking-wide uppercase">
                            <ChefHat className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Tableau de bord personnel</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            Bonjour <span className="text-emerald-300">{fullName}</span> ! 👋
                        </h1>
                        <p className="text-emerald-100/80 text-sm md:text-base max-w-xl">
                            Voici un aperçu de vos équilibres nutritionnels et de votre parcours gourmand cette semaine.
                        </p>
                    </div>
                    <Button 
                        onClick={() => navigate(webRoutes.join_now)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-6 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
                    >
                        <span>Commander un plat</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Main content grid */}
            <div className="grid gap-8 lg:grid-cols-12">
                {/* Left column - Nutrition Summary & Tip (span 7) */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Nutrition Card */}
                    <Card className="border-emerald-100/60 shadow-xl shadow-slate-100/50 rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="bg-gradient-to-b from-emerald-50/50 to-transparent pb-4 border-b border-emerald-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                                        <Flame className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-800">Bilan nutritionnel</CardTitle>
                                        <p className="text-xs text-muted-foreground">Répartition de vos apports journaliers</p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                                    Objectif actif
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6 space-y-6">
                            {/* Graphic + Donut summary */}
                            <div className="flex flex-col sm:flex-row items-center gap-8 justify-center sm:justify-start">
                                {/* SVG Donut Chart à 3 couleurs */}
                                <div className="relative flex-shrink-0">
                                    <svg width="160" height="160" className="transform -rotate-90 drop-shadow-sm">
                                        <circle cx="80" cy="80" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="16" />
                                        {/* Protéines (Emerald) */}
                                        <circle
                                            cx="80" cy="80" r={radius} fill="none"
                                            stroke="#10b981" strokeWidth="16"
                                            strokeDasharray={`${(proteinPercentage / 100) * circumference} ${circumference}`}
                                            strokeDashoffset={0}
                                            strokeLinecap="round"
                                        />
                                        {/* Glucides (Amber) */}
                                        <circle
                                            cx="80" cy="80" r={radius} fill="none"
                                            stroke="#f59e0b" strokeWidth="16"
                                            strokeDasharray={`${(carbsPercentage / 100) * circumference} ${circumference}`}
                                            strokeDashoffset={-carbsOffset}
                                            strokeLinecap="round"
                                        />
                                        {/* Lipides (Rose) */}
                                        <circle
                                            cx="80" cy="80" r={radius} fill="none"
                                            stroke="#f43f5e" strokeWidth="16"
                                            strokeDasharray={`${(fatPercentage / 100) * circumference} ${circumference}`}
                                            strokeDashoffset={-fatOffset}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    {/* Texte central */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-2xl font-black text-slate-900 tracking-tight">{totalCalories.toLocaleString()}</span>
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kcal</span>
                                    </div>
                                </div>

                                {/* Aperçu rapide des 3 macros combinant grammes et calories */}
                                <div className="w-full space-y-3">
                                    <div className="flex items-center justify-between p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                            <span className="text-sm font-medium text-slate-700">Protéines</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">{protein}g <span className="text-xs font-normal text-muted-foreground">({proteinCalories} kcal)</span></span>
                                    </div>
                                    <div className="flex items-center justify-between p-2.5 bg-amber-50/50 rounded-xl border border-amber-100/50">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                            <span className="text-sm font-medium text-slate-700">Glucides</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">{carbs}g <span className="text-xs font-normal text-muted-foreground">({carbsCalories} kcal)</span></span>
                                    </div>
                                    <div className="flex items-center justify-between p-2.5 bg-rose-50/50 rounded-xl border border-rose-100/50">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                                            <span className="text-sm font-medium text-slate-700">Lipides</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">{fat}g <span className="text-xs font-normal text-muted-foreground">({fatCalories} kcal)</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* Progression par rapport aux objectifs */}
                            <div className="pt-4 border-t border-slate-100 space-y-4">
                                <h4 className="font-semibold text-slate-800 text-sm">Progression des apports</h4>
                                
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                                        <span>Protéines</span>
                                        <span className="font-bold text-slate-800">{protein}g / 150g</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((protein / 150) * 100, 100)}%` }}></div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                                        <span>Glucides</span>
                                        <span className="font-bold text-slate-800">{carbs}g / 250g</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((carbs / 250) * 100, 100)}%` }}></div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                                        <span>Lipides</span>
                                        <span className="font-bold text-slate-800">{fat}g / 70g</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((fat / 70) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Motivational Corner */}
                    <Card className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-200/60 rounded-3xl overflow-hidden shadow-sm">
                        <CardContent className="pt-6 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-600">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-900 text-base">Conseil Nutrition & Forme</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Si votre objectif est la perte de poids, maintenez un léger déficit calorique tout en privilégiant des repas riches en protéines de qualité pour préserver votre masse musculaire.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right column - Quick Stats & Meal History (span 5) */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200/60 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Commandes</p>
                                        <p className="text-3xl font-black text-slate-900">{data.orders_this_month}</p>
                                        {data.orders_difference !== 0 && (
                                            <div className="flex items-center gap-1 pt-1">
                                                <TrendingUp className={`w-3.5 h-3.5 ${data.orders_difference > 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
                                                <span className={`text-xs font-bold ${data.orders_difference > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                                                    {data.orders_difference > 0 ? '+' : ''}{data.orders_difference} ce mois
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/60 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-purple-800">Points commandes</p>
                                        <p className="text-3xl font-black text-slate-900">{data.order_points_balance} / {data.order_points_threshold}</p>
                                        <p className="text-xs text-purple-700 font-medium pt-1">Solde actuel</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                                        <Gift className="w-5 h-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-200/60 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Points partage</p>
                                        <p className="text-3xl font-black text-slate-900">{data.share_points_balance} / {data.share_points_threshold}</p>
                                        <p className="text-xs text-amber-700 font-medium pt-1">Solde actuel</p>
                                    </div>
                                    <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-600/30">
                                        <Gift className="w-5 h-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/60 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-green-800">Repas gratuits</p>
                                        <p className="text-3xl font-black text-slate-900">{data.free_meal_credits}</p>
                                        <p className="text-xs text-green-700 font-medium pt-1">Crédits disponibles</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-600/30">
                                        <Gift className="w-5 h-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Meal History */}
                    <Card className="border-slate-100 shadow-xl shadow-slate-100/50 rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="bg-gradient-to-b from-slate-50/80 to-transparent pb-4 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-800">Historique des repas</CardTitle>
                                <p className="text-xs text-muted-foreground">Vos plats savourés récemment</p>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3.5">
                                {(data.meals_history ?? []).length === 0 ? (
                                    <div className="text-muted-foreground py-12 text-center text-sm">
                                        Aucun repas trouvé dans votre historique.
                                    </div>
                                ) : (
                                    (data.meals_history ?? []).slice(0, 4).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="group flex items-center justify-between p-3.5 bg-slate-50/60 hover:bg-emerald-50/30 border border-slate-100 hover:border-emerald-200/60 rounded-2xl transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                                    <span className="text-xl">🥗</span>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <span className="font-bold text-slate-800 text-sm block leading-tight">{item.meal_name}</span>
                                                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                                        {new Date(item.order_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                                                        {item.price && <span className="text-emerald-700 font-semibold">• {item.price}</span>}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(webRoutes.join_now)}
                                                className="bg-white hover:bg-emerald-600 hover:text-white text-emerald-700 border-emerald-200 hover:border-emerald-600 rounded-xl font-semibold text-xs px-3.5 py-2 h-auto shadow-sm transition-all"
                                            >
                                                Recommander
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
