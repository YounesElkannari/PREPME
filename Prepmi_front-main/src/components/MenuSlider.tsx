 import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
 import { useTranslation } from "react-i18next"
 
import { MealCard } from "./MealCard"
import { useState, useEffect } from "react"
import http from "@/utils/http"
import { apiRoutes } from "@/routes/api"
import { handleErrorResponse } from "@/utils"
import { Meal } from "@/interfaces/admin"

export function MenuSlider() {
    const { t } = useTranslation();
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Fetch meals on component mount
    useEffect(() => {
        setLoading(true);
        http.get(apiRoutes.meals)
            .then((res) => {
                const mealsData = res.data.data || res.data;
                // Limit to first 6 meals for the slider
                setMeals(Array.isArray(mealsData) ? mealsData.slice(0, 6) : []);
            })
            .catch((e) => {
                handleErrorResponse(e);
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Loading state
    if (loading) {
        return (
            <section className="py-16 md:py-24 bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
                <div className="container px-4 md:px-6 relative">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            <span className="text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                                {t('menu.badge')}
                            </span>
                            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-4 leading-tight">
                            {t('menu.title')}
                        </h2>
                    </div>
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">{t('common.loading', 'Chargement...')}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error || meals.length === 0) {
        return (
            <section className="py-16 md:py-24 bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
                <div className="container px-4 md:px-6 relative">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            <span className="text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                                {t('menu.badge')}
                            </span>
                            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-4 leading-tight">
                            {t('menu.title')}
                        </h2>
                    </div>
                    <div className="flex justify-center items-center min-h-[400px]">
                        <p className="text-muted-foreground text-lg">
                            {error ? t('common.error', 'Une erreur est survenue') : t('menu.no_meals', 'Aucun repas disponible')}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

            <div className="container px-4 md:px-6 relative">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        <span className="text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                            {t('menu.badge')}
                        </span>
                        <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-4 leading-tight">
                        {t('menu.title')}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        {t('menu.description')}
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {meals.map((meal, index) => (
                                <CarouselItem key={meal.id || index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                    <MealCard meal={meal} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4 bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground" />
                        <CarouselNext className="right-4 bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground" />
                    </Carousel>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <p className="text-muted-foreground mb-6 text-lg">{t('menu.cta_text')}</p>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="w-16 h-1 bg-gradient-to-r from-transparent to-primary rounded-full"></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-16 h-1 bg-gradient-to-r from-primary via-secondary to-transparent rounded-full"></div>
                        <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                        <div className="w-16 h-1 bg-gradient-to-r from-secondary to-transparent rounded-full"></div>
                    </div>
                    <button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-1">
                        {t('menu.view_full_menu')}
                    </button>
                </div>
            </div>
        </section>
    );
}