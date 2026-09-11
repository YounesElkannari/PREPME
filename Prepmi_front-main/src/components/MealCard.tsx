import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
    Flame,
    Zap,
    Clock,
    ChefHat,
    Leaf,
    Wheat,
    Heart,
    Star
} from "lucide-react"
import { Meal } from "@/interfaces/admin";
import { webRoutes } from "@/routes/web"



interface MealCardProps {
    meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(webRoutes.meal_single.replace(':id', meal.id?.toString() || ''));
    };

    const getDietaryIcons = (meal: Meal) => {
        const icons = [];
        if (meal.dietary_info?.is_vegan || meal.is_vegan) icons.push({ icon: <Leaf className="w-3 h-3" />, label: t('menu.vegan'), color: "bg-primary/10 text-primary border-primary/20" });
        else if (meal.dietary_info?.is_vegetarian || meal.is_vegetarian) icons.push({ icon: <Leaf className="w-3 h-3" />, label: t('menu.vegetarian'), color: "bg-primary/10 text-primary border-primary/20" });
        if (meal.dietary_info?.is_gluten_free || meal.is_gluten_free) icons.push({ icon: <Wheat className="w-3 h-3" />, label: t('menu.gluten_free'), color: "bg-secondary/10 text-secondary border-secondary/20" });
        if (meal.dietary_info?.is_high_protein || meal.is_high_protein) icons.push({ icon: <Zap className="w-3 h-3" />, label: t('menu.high_protein'), color: "bg-primary/15 text-primary border-primary/30" });
        if (meal.dietary_info?.is_keto || meal.is_keto) icons.push({ icon: <Heart className="w-3 h-3" />, label: t('menu.keto'), color: "bg-secondary/15 text-secondary border-secondary/30" });
        if (meal.is_spicy) icons.push({ icon: <Flame className="w-3 h-3" />, label: t('menu.spicy'), color: "bg-secondary/20 text-secondary border-secondary/40" });
        return icons.slice(0, 3); // Show max 3 badges
    };

    const getDifficultyLevel = (difficulty?: number | string) => {
        if (typeof difficulty === 'number') {
            if (difficulty === 1) return 'Easy';
            if (difficulty === 2) return 'Medium';
            if (difficulty === 3) return 'Hard';
        }
        return difficulty || 'Easy';
    };

    const getDifficultyColor = (difficulty: string | number) => {
        const level = typeof difficulty === 'number' ? getDifficultyLevel(difficulty) : difficulty;
        switch (level) {
            case 'Easy': return 'bg-primary/10 text-primary border-primary/20';
            case 'Medium': return 'bg-secondary/10 text-secondary border-secondary/20';
            case 'Hard': return 'bg-secondary/20 text-secondary border-secondary/40';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    return (
        <Card
            className="group h-full hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-border/50 hover:border-primary/30 shadow-lg bg-card/90 dark:bg-card/95 backdrop-blur-sm overflow-hidden hover:-translate-y-1 cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={meal.image_url || meal.image_path || '/healthy-meal-bowl.png'}
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Price Badge */}
                <div className="absolute top-4 right-4">
                    {/* <Badge className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold px-3 py-1.5 shadow-lg hover:shadow-primary/25 transition-all duration-300 border-0">
                        {typeof meal.price === 'number' ? meal.price.toFixed(2) : meal.price} {t('menu.currency')}
                    </Badge> */}
                </div>

                {/* Difficulty Badge */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge className={`${getDifficultyColor(meal.difficulty_level || 1)} font-medium px-2 py-1 text-xs border backdrop-blur-sm transition-all duration-300 hover:text-white hover:bg-primary hover:border-primary`}>
                        <ChefHat className="w-3 h-3 mr-1" />
                        {getDifficultyLevel(meal.difficulty_level)}
                    </Badge>

                </div>

                {/* Spice level indicator */}
                {meal.is_spicy && (
                    <div className="absolute bottom-4 right-4 flex space-x-0.5">
                        {Array.from({ length: 3 }, (_, i) => (
                            <Flame
                                key={i}
                                className={`w-3 h-3 ${i < (meal.spice_level || 0) ? 'text-secondary' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CardContent className="p-6">
                {/* Meal Name */}
                <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                    {meal.name}
                </h3>

                {/* Short Description */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                    {meal.short_description}
                </p>

                {/* Nutrition Info */}
                <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-2 text-sm">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary/20 to-secondary/10 flex items-center justify-center">
                            <Flame className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                            <span className="font-bold text-foreground">{meal.nutrition?.calories || meal.calories || 0}</span>
                            <span className="text-muted-foreground text-xs ml-1">{t('menu.kcal')}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <span className="font-bold text-foreground">{meal.nutrition?.protein || meal.protein || 0}g</span>
                            <span className="text-muted-foreground text-xs ml-1">{t('menu.protein')}</span>
                        </div>
                    </div>
                </div>

                {/* Dietary Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {getDietaryIcons(meal).map((item, i) => (
                        <Badge
                            key={i}
                            className={`${item.color} font-medium px-2 py-1 text-xs flex items-center space-x-1 border transition-all duration-300 hover:scale-105 hover:text-white hover:bg-primary hover:border-primary`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Badge>
                    ))}
                </div>

                {/* Time Info */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="w-3 h-3 text-primary" />
                        </div>
                        <span className="font-medium">
                            {(meal.preparation?.prep_time_minutes || meal.prep_time_minutes || 0) +
                                (meal.preparation?.cooking_time_minutes || meal.cooking_time_minutes || 0)} {t('menu.mins')}
                        </span>
                    </div>
                    {meal.is_membership ? (
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold px-2 py-1 text-xs border-0 backdrop-blur-sm transition-all duration-300 shadow-md">
                            <Star className="w-3 h-3 mr-1 fill-white" />
                            {t('menu.membership')}
                        </Badge>
                    ) : null}
                </div>

                {/* Action Button */}
                {/* <div className="mt-4 pt-4 border-t border-border/50">
                        <button
                            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                            onClick={(e) => {
                                e.stopPropagation();
                                // Handle add to plan action here
                            }}
                        >
                            {t('menu.add_to_plan')}
                        </button>
                    </div> */}
            </CardContent>
        </Card>
    );
}
