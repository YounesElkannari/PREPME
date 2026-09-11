import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Check, X, ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Meal, Reward } from "@/interfaces/admin";

interface RewardsSectionProps {
    availableRewards: Reward[];
    showRewards: boolean;
    setShowRewards: (show: boolean) => void;
    appliedReward: Reward | null;
    getRewardEligibleMeals: (reward: Reward) => Meal[];
    handleApplyReward: (mealId: number, rewardId: number) => void;
}

export function RewardsSection({
    availableRewards,
    showRewards,
    setShowRewards,
    appliedReward,
    getRewardEligibleMeals,
    handleApplyReward,
}: RewardsSectionProps) {
    const { t } = useTranslation();

    if (availableRewards.length === 0) return null;

    return (
        <Card className="border-2 border-dashed border-secondary/30 bg-secondary/5">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Gift className="w-6 h-6 text-secondary" />
                    <div>
                        <CardTitle className="text-lg">
                            {t("joinNow.meals.availableRewards")}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {t("joinNow.meals.freeMealRewards", {
                                count: availableRewards.length,
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant={showRewards ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowRewards(true)}
                        className="flex items-center space-x-1"
                    >
                        <Check className="w-4 h-4" />
                        <span>{t("joinNow.meals.view")}</span>
                    </Button>
                    <Button
                        variant={!showRewards ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowRewards(false)}
                        className="flex items-center space-x-1"
                    >
                        <X className="w-4 h-4" />
                        <span>{t("joinNow.meals.hide")}</span>
                    </Button>
                </div>
            </CardHeader>

            {showRewards && (
                <CardContent className="space-y-6">
                    {availableRewards.map((reward) => {
                        const eligibleMeals = getRewardEligibleMeals(reward);
                        const isApplied = appliedReward?.id === reward.id;

                        return (
                            <div key={reward.id} className="border rounded-lg p-4 bg-card">
                                <div className="mb-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-semibold text-lg">{reward.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {reward.description}
                                            </p>
                                        </div>
                                    </div>
                                    {isApplied && (
                                        <Badge className="bg-green-500 text-white">
                                            <Check className="w-3 h-3 mr-1" />
                                            {t("joinNow.meals.applied")}
                                        </Badge>
                                    )}
                                </div>

                                <p className="text-sm font-medium mb-3 text-foreground">
                                    {t("joinNow.meals.selectMealForReward", {
                                        count: eligibleMeals.length,
                                    })}
                                </p>

                                {eligibleMeals.length === 0 ? (
                                    <div className="text-center py-6">
                                        <p className="text-muted-foreground">
                                            {t("joinNow.meals.noMealsForReward")}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {eligibleMeals.map((meal: Meal) => (
                                            <Card
                                                key={meal.id}
                                                className={`relative hover:shadow-lg transition-all ${isApplied && appliedReward?.meal_id === meal.id
                                                    ? "ring-2 ring-secondary"
                                                    : ""
                                                    }`}
                                            >
                                                <div className="relative h-32 overflow-hidden rounded-t-lg">
                                                    {meal.image_url || meal.image_path ? (
                                                        <img
                                                            src={meal?.image_url || meal?.image_path || ""}
                                                            alt={meal.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <ImageIcon className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>

                                                <CardContent className="p-4">
                                                    <h4 className="font-semibold mb-1 text-sm">
                                                        {meal.name}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground mb-3">
                                                        {meal.short_description || meal.description}
                                                    </p>

                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="text-xs text-muted-foreground">
                                                            {meal.calories || 0} {t("joinNow.meals.kcal")} •{" "}
                                                            {meal.protein || 0}g {t("joinNow.meals.protein")}
                                                        </div>
                                                    </div>

                                                    <Button
                                                        size="sm"
                                                        variant={
                                                            isApplied && appliedReward?.meal_id === meal.id
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        className="w-full"
                                                        onClick={() => handleApplyReward(meal.id!, reward.id!)}
                                                    >
                                                        {isApplied && appliedReward?.meal_id === meal.id ? (
                                                            <>
                                                                <Check className="w-3 h-3 mr-1" />
                                                                {t("joinNow.meals.applied")}
                                                            </>
                                                        ) : (
                                                            <>{t("joinNow.meals.applyReward")}</>
                                                        )}
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            )}
        </Card>
    );
}
