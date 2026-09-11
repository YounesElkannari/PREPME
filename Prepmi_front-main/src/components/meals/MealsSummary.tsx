import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Meal, Reward } from "@/interfaces/admin";

interface MealsSummaryProps {
    selectedMealObjects: any[];
    selectedDrinkObjects: any[];
    selectedFreeDesserts: { [key: number]: Meal & { quantity: number } };
    hasFreeDesserts: boolean;
    appliedReward: Reward | null;
    appliedRewardMeal: Meal | null;
}

export function MealsSummary({
    selectedMealObjects,
    selectedDrinkObjects,
    selectedFreeDesserts,
    hasFreeDesserts,
    appliedReward,
    appliedRewardMeal,
}: MealsSummaryProps) {
    const { t } = useTranslation();

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-lg">
                    {t("joinNow.meals.selectedMealsDrinksSummary")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Applied Reward Section */}
                {appliedReward && appliedRewardMeal && (
                    <div className="mb-6 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Gift className="w-5 h-5 text-secondary" />
                                <h4 className="font-semibold text-foreground">
                                    {t("joinNow.meals.appliedReward")}
                                </h4>
                            </div>
                            <Badge className="bg-secondary text-white">
                                {Number(appliedReward.value).toFixed(2)} MAD
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                            {appliedReward.title}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                            {appliedReward.description}
                        </p>

                        {/* Reward Meal Display */}
                        <div className="mt-3 p-3 bg-white dark:bg-card rounded border border-secondary/20 flex items-center gap-3">
                            {appliedRewardMeal.image_url || appliedRewardMeal.image_path ? (
                                <img
                                    src={
                                        appliedRewardMeal.image_url ||
                                        appliedRewardMeal.image_path ||
                                        ""
                                    }
                                    alt={appliedRewardMeal.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-semibold text-foreground">
                                    {appliedRewardMeal.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {appliedRewardMeal.calories || 0} {t("joinNow.meals.kcal")} •{" "}
                                    {appliedRewardMeal.protein || 0}g {t("joinNow.meals.protein")}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {t("joinNow.meals.price")}:{" "}
                                    {Number(appliedRewardMeal.price).toFixed(2)} MAD
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <h4 className="font-semibold mb-2">{t("joinNow.meals.meals")}</h4>
                    {selectedMealObjects.length === 0 ? (
                        <div className="text-muted-foreground">
                            {t("joinNow.meals.noMealsSelected")}
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {selectedMealObjects.map((meal: any) => (
                                <li key={meal.id} className="flex items-center gap-4">
                                    {meal.image_url || meal.image_path ? (
                                        <img
                                            src={meal.image_url || meal.image_path}
                                            alt={meal.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <span className="font-semibold">{meal.name}</span>
                                        <span className="ml-2 text-sm text-muted-foreground">
                                            {t("joinNow.meals.quantity", { count: meal.quantity })}
                                        </span>
                                        <div className="text-xs text-muted-foreground">
                                            {t("joinNow.meals.proteinLabel")}: {meal.protein}g |{" "}
                                            {t("joinNow.meals.calories")}: {meal.calories}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-6">
                    <h4 className="font-semibold mb-2">{t("joinNow.meals.drinks")}</h4>
                    {selectedDrinkObjects.length === 0 ? (
                        <div className="text-muted-foreground">
                            {t("joinNow.meals.noDrinksSelected")}
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {selectedDrinkObjects.map((drink: any) => (
                                <li key={drink.id} className="flex items-center gap-4">
                                    {drink.image_url || drink.image_path ? (
                                        <img
                                            src={drink.image_url || drink.image_path}
                                            alt={drink.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <span className="font-semibold">{drink.name}</span>
                                        <span className="ml-2 text-sm text-muted-foreground">
                                            {t("joinNow.meals.quantity", { count: drink.quantity })}
                                        </span>
                                        <div className="text-xs text-muted-foreground">
                                            {t("joinNow.meals.proteinLabel")}: {drink.protein}g |{" "}
                                            {t("joinNow.meals.calories")}: {drink.calories}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Free Desserts Summary */}
                {hasFreeDesserts && Object.keys(selectedFreeDesserts).length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold mb-2 text-green-700">
                            {t("joinNow.meals.freeDessertsMembership")}
                        </h4>
                        <ul className="space-y-2">
                            {Object.values(selectedFreeDesserts).map((drink: any) => (
                                <li
                                    key={drink.id}
                                    className="flex items-center gap-4 bg-green-50 p-2 rounded"
                                >
                                    {drink.image_url || drink.image_path ? (
                                        <img
                                            src={drink.image_url || drink.image_path}
                                            alt={drink.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <span className="font-semibold text-green-800">
                                            {drink.name}
                                        </span>
                                        <span className="ml-2 text-sm text-green-600">
                                            {t("joinNow.meals.quantity", { count: drink.quantity })}
                                        </span>
                                        <Badge className="ml-2 bg-green-600 text-white text-xs">
                                            {t("joinNow.meals.free")}
                                        </Badge>
                                        <div className="text-xs text-green-600">
                                            {t("joinNow.meals.proteinLabel")}: {drink.protein}g |{" "}
                                            {t("joinNow.meals.calories")}: {drink.calories}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
