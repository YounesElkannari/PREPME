import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Utensils, Check, Gift } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reward } from "@/interfaces/admin";

interface PlanSummaryProps {
    planData: any;
    totalSelectedMeals: number;
    userMembership: any;
    membershipPlan: any;
    hasFreeDesserts: boolean;
    freeDessertsQuantity: number;
    membershipDiscount: number;
    selectedFreeDesserts: { [key: number]: any };
    availableRewards: Reward[];
}

export function PlanSummary({
    planData,
    totalSelectedMeals,
    userMembership,
    membershipPlan,
    hasFreeDesserts,
    freeDessertsQuantity,
    membershipDiscount,
    selectedFreeDesserts,
    availableRewards,
}: PlanSummaryProps) {
    const { t } = useTranslation();

    return (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:space-x-6 space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {t("joinNow.meals.proteinPreference")}
                            </p>
                            <p className="font-semibold text-foreground">
                                {planData?.category?.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Badge className="w-5 h-5 bg-primary text-primary-foreground">
                                {planData?.mealsPerWeek || 0}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {t("joinNow.meals.mainMeals")}
                            </p>
                            <p className="font-semibold text-foreground">
                                {totalSelectedMeals}/{planData?.mealsPerWeek || 0}
                            </p>
                        </div>
                    </div>

                    {/* Membership Section */}
                    {userMembership && membershipPlan && (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {t("joinNow.meals.membership")}
                                </p>
                                <p className="font-semibold text-foreground">
                                    {membershipPlan.name}
                                </p>
                                {membershipDiscount > 0 && (
                                    <p className="text-xs text-green-600">
                                        {membershipDiscount}% {t("joinNow.meals.discount")}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Free Desserts/Drinks */}
                    {hasFreeDesserts && freeDessertsQuantity > 0 && (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                                <Gift className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {t("joinNow.meals.freeDessertsPerMonth")}
                                </p>
                                <p className="font-semibold text-foreground">
                                    {Object.values(selectedFreeDesserts).reduce(
                                        (sum: number, drink: any) => sum + (drink.quantity || 0),
                                        0
                                    )}
                                    /{freeDessertsQuantity}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {t("joinNow.meals.deliveryDate")}
                            </p>
                            <p className="font-semibold text-foreground">
                                {t("joinNow.meals.deliveryWeek", "During the week")}
                            </p>
                        </div>
                    </div>

                    {availableRewards.length > 0 && (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                                <Gift className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {t("joinNow.meals.availableRewards")}
                                </p>
                                <p className="font-semibold text-foreground">
                                    1
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
