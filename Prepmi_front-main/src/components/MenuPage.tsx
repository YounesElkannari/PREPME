import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MealCard } from "./MealCard"
import { useQuery } from "@tanstack/react-query"
import http from "@/utils/http"
import { apiRoutes } from "@/routes/api"
import { handleErrorResponse } from "@/utils"
import {
    Calendar,
    ChefHat,
    Coffee,
    Utensils,
    Wine,
    Sparkles,
    Clock,
    TrendingUp,
    Flame
} from "lucide-react"
import { Meal } from "@/interfaces/admin"

export function MenuPage() {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState<string>('weekly');
    const [isAnimating, setIsAnimating] = useState(false);

    // Fetch all meals
    const { isLoading: isLoadingMeals, data: mealsResponse } = useQuery<{ data: Meal[] }>({
        queryKey: ["meals"],
        queryFn: () =>
            http
                .get(apiRoutes.meals)
                .then((res) => res.data)
                .catch((e) => {
                    handleErrorResponse(e);
                    throw e;
                }),
    });

    // Fetch drinks (type_id=2)
    const { isLoading: isLoadingDrinks, data: drinksResponse } = useQuery<{ data: Meal[] }>({
        queryKey: ["meals", "drinks"],
        queryFn: () =>
            http
                .get(`${apiRoutes.meals}?type_id=2`)
                .then((res) => res.data)
                .catch((e) => {
                    handleErrorResponse(e);
                    throw e;
                }),
    });

    // Fetch categories
    const { isLoading: isLoadingCategories, data: categoriesResponse } = useQuery<{ data: any[] }>({
        queryKey: ["categories"],
        queryFn: () =>
            http
                .get(apiRoutes.categories)
                .then((res) => res.data)
                .catch((e) => {
                    handleErrorResponse(e);
                    throw e;
                }),
    });

    const allMeals = mealsResponse?.data || [];
    const mainMeals = allMeals.filter(meal =>
        meal.type === 'lunch' || meal.type === 'dinner' ||
        meal.category?.slug === 'weekly' ||
        (!meal.type?.includes('breakfast') && !meal.category?.name?.toLowerCase().includes('breakfast') && meal.category?.slug !== 'drinks')
    );
    const breakfasts = allMeals.filter(meal =>
        meal.type === 'breakfast' || meal.category?.name?.toLowerCase().includes('breakfast')
    );
    const drinks = drinksResponse?.data || [];

    const isLoading = isLoadingMeals || isLoadingDrinks || isLoadingCategories;

    // Calculate stats from meals data
    const totalRecipes = allMeals.length || 0;
    const avgPrepTime = allMeals.length > 0
        ? Math.round(allMeals.reduce((sum, meal) => sum + ((meal.prep_time_minutes || 0) + (meal.cooking_time_minutes || 0)), 0) / allMeals.length)
        : 15;
    const satisfactionRate = 98;

    const statsItems = [
        {
            icon: <ChefHat className="w-7 h-7 text-white drop-shadow-md" />,
            gradient: 'bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-emerald-500/30',
            value: `${totalRecipes}+`,
            label: t('menu.recipes') || 'Recettes Exclusives'
        },
        {
            icon: <Clock className="w-7 h-7 text-white drop-shadow-md" />,
            gradient: 'bg-gradient-to-tr from-blue-600 to-indigo-400 shadow-blue-500/30',
            value: `${avgPrepTime}m`,
            label: t('menu.avg_prep_time') || 'Temps de Préparation'
        },
        {
            icon: <TrendingUp className="w-7 h-7 text-white drop-shadow-md" />,
            gradient: 'bg-gradient-to-tr from-amber-500 to-orange-400 shadow-amber-500/30',
            value: `${satisfactionRate}%`,
            label: t('menu.satisfaction') || 'Avis Clients'
        },
        {
            icon: <Flame className="w-7 h-7 text-white drop-shadow-md" />,
            gradient: 'bg-gradient-to-tr from-rose-500 to-pink-500 shadow-rose-500/30',
            value: '100%',
            label: t('menu.fresh_made') || 'Fait Maison & Frais'
        }
    ];

    const apiCategories = categoriesResponse?.data || [];
    const categories = apiCategories.map((cat: any) => {
        const slug = cat.slug || cat.id.toString();
        let icon = <Utensils className="w-5 h-5" />;
        let gradientStyle = "from-emerald-500 to-teal-600 text-white shadow-emerald-500/25";

        if (slug === 'weekly') {
            icon = <Calendar className="w-5 h-5" />;
            gradientStyle = "from-emerald-600 to-green-500 text-white shadow-emerald-500/30";
        } else if (slug === 'breakfast') {
            icon = <Coffee className="w-5 h-5" />;
            gradientStyle = "from-amber-500 to-orange-500 text-white shadow-amber-500/30";
        } else if (slug === 'drinks') {
            icon = <Wine className="w-5 h-5" />;
            gradientStyle = "from-purple-600 to-indigo-500 text-white shadow-purple-500/30";
        }

        return {
            id: slug,
            name: cat.name,
            icon,
            gradientStyle
        };
    });

    const handleCategoryChange = (category: string) => {
        setIsAnimating(true);
        setTimeout(() => {
            setActiveCategory(category);
            setIsAnimating(false);
        }, 150);
    };

    const filteredMeals = (() => {
        if (activeCategory === 'weekly') {
            return mainMeals;
        } else if (activeCategory === 'breakfast') {
            return breakfasts;
        } else if (activeCategory === 'drinks') {
            return drinks;
        } else {
            return allMeals.filter(meal =>
                meal.type === activeCategory ||
                meal.category?.slug === activeCategory ||
                meal.category?.name?.toLowerCase().includes(activeCategory.toLowerCase())
            );
        }
    })();

    return (
        <div className="min-h-screen bg-slate-50/70 pb-24 overflow-hidden">
            
            {/* Hero Banner 3D / Colorisé */}
            <div className="relative bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white pt-28 pb-20 px-4 overflow-hidden">
                {/* Cercles lumineux décoratifs en arrière-plan */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
                
                <div className="container mx-auto max-w-4xl text-center relative z-10 space-y-5">
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/20 text-emerald-300 shadow-inner">
                        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                        <span>{t('menu.fresh_daily', 'Expérience Culinaire Premium')}</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
                        {t('menu.our_menu', 'Notre Menu Délicieux')}
                    </h1>
                    
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                        {t('menu.description_page', 'Des plats conçus par des chefs pour allier plaisir et équilibre nutritionnel au quotidien.')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                
                {/* 3D / Floating Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {statsItems.map((stat, index) => (
                        <div 
                            key={index} 
                            className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center space-x-4 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${stat.gradient} shadow-lg flex items-center justify-center shrink-0`}>
                                {stat.icon}
                            </div>
                            <div>
                                <div className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                                <div className="text-xs font-medium text-slate-500">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Categories Pills Colorisées avec Effet 3D au clic */}
                <div className="flex items-center justify-center gap-3 flex-wrap mb-14">
                    {categories.map((category) => {
                        const isActive = activeCategory === category.id;
                        return (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`flex items-center space-x-3 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 transform ${
                                    isActive
                                        ? `bg-gradient-to-r ${category.gradientStyle} shadow-lg scale-105 ring-2 ring-white/50`
                                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-sm hover:scale-[1.02]'
                                }`}
                            >
                                <span className={`p-1.5 rounded-xl ${isActive ? 'bg-white/20' : 'bg-slate-100 text-emerald-600'}`}>
                                    {category.icon}
                                </span>
                                <span>{category.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Meals Grid Section */}
                <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-4">
                                    <div className="animate-pulse">
                                        <div className="h-52 bg-slate-200 rounded-2xl mb-4"></div>
                                        <div className="h-5 bg-slate-200 rounded-lg mb-3 w-3/4"></div>
                                        <div className="h-4 bg-slate-200 rounded-lg mb-2 w-full"></div>
                                        <div className="h-4 bg-slate-200 rounded-lg w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredMeals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredMeals.map((meal, index) => (
                                <div
                                    key={meal.id || meal.slug}
                                    className="animate-fade-in-up transition-transform duration-300 hover:-translate-y-2"
                                    style={{ animationDelay: `${index * 80}ms` }}
                                >
                                    <MealCard meal={meal} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-lg max-w-md mx-auto p-8">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                <ChefHat className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                {t('menu.no_meals') || 'Aucun plat disponible'}
                            </h3>
                            <p className="text-slate-500 text-sm">
                                {activeCategory === 'weekly'
                                    ? (t('menu.no_meals_date') || 'Essayez de sélectionner une autre catégorie.')
                                    : (t('menu.coming_soon') || 'De nouvelles recettes arrivent très bientôt !')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}