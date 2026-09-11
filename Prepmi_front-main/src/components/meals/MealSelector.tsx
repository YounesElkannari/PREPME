import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MealCard } from "@/components/MealCard";
import { Meal } from "@/interfaces/admin";

interface MealSelectorProps {
    allMeals: Meal[];
    isLoadingMeals: boolean;
    selectedMeals: { [key: number]: Meal & { quantity: number } };
    remainingMeals: number;
    canAddMealToBasket: (meal: Meal) => boolean;
    handleMealQuantityChange: (mealId: number, change: number) => void;
    handleMembershipRedirect: () => void;
}

export function MealSelector({
    allMeals,
    isLoadingMeals,
    selectedMeals,
    remainingMeals,
    canAddMealToBasket,
    handleMealQuantityChange,
    handleMembershipRedirect,
}: MealSelectorProps) {
    const { t } = useTranslation();

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">
                {t("joinNow.meals.allAvailableMeals")}
            </h3>
            {isLoadingMeals ? (
                // Loading skeleton
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="border-2 border-gray-200">
                            <CardContent className="p-6">
                                <div className="animate-pulse">
                                    <div className="h-40 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : allMeals.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        {t("joinNow.meals.noMealsAvailable")}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allMeals.map((meal) => (
                        <div key={meal.id} className="relative">
                            <MealCard meal={meal} />

                            {/* Quantity Selector Overlay or Membership Button */}
                            {canAddMealToBasket(meal) ? (
                                // Show normal add/minus buttons if user can add to basket
                                <div className="absolute top-4 left-4 bg-white dark:bg-card rounded-lg shadow-lg border border-border p-2 flex items-center space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleMealQuantityChange(meal.id, -1)}
                                        disabled={!selectedMeals[meal.id]}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>

                                    <span className="min-w-[2rem] text-center font-semibold">
                                        {selectedMeals[meal.id]?.quantity || 0}
                                    </span>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleMealQuantityChange(meal.id, 1)}
                                        disabled={remainingMeals === 0}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                // Show membership button if meal requires membership and user doesn't have it
                                <div className="absolute top-4 left-4 bg-white dark:bg-card rounded-lg shadow-lg border border-border">
                                    <Button
                                        size="sm"
                                        variant="default"
                                        className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold"
                                        onClick={handleMembershipRedirect}
                                    >
                                        <Crown className="h-4 w-4 mr-2" />
                                        {t("menu.get_membership", "Get Membership")}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
