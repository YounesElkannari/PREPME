import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Plus, Minus, ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Meal } from "@/interfaces/admin";

interface FreeDessertsProps {
    hasFreeDesserts: boolean;
    freeDessertsQuantity: number;
    membershipPlan: any;
    drinks: Meal[];
    isLoadingDrinks: boolean;
    selectedFreeDesserts: { [key: number]: Meal & { quantity: number } };
    handleFreeDessertQuantityChange: (itemId: number, change: number) => void;
}

export function FreeDesserts({
    hasFreeDesserts,
    freeDessertsQuantity,
    membershipPlan,
    drinks,
    isLoadingDrinks,
    selectedFreeDesserts,
    handleFreeDessertQuantityChange,
}: FreeDessertsProps) {
    const { t } = useTranslation();

    if (!hasFreeDesserts || freeDessertsQuantity <= 0) return null;

    return (
        <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
                <div className="flex items-center space-x-3">
                    <Gift className="w-6 h-6 text-green-600" />
                    <div>
                        <CardTitle className="text-lg text-green-800">
                            {t("joinNow.meals.freeDessertsMembershipBenefit")}
                        </CardTitle>
                        <p className="text-sm text-green-600">
                            {t("joinNow.meals.selectFreeDesserts", {
                                count: freeDessertsQuantity,
                                membershipName: membershipPlan?.name,
                            })}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoadingDrinks ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Card key={index} className="border-2 border-gray-200">
                                <CardContent className="p-4">
                                    <div className="animate-pulse">
                                        <div className="h-32 bg-gray-200 rounded mb-3"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : drinks.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">
                            {t("joinNow.meals.noDrinksAvailable")}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-center">
                            <Badge
                                variant="outline"
                                className="text-green-600 border-green-300"
                            >
                                {Object.values(selectedFreeDesserts).reduce(
                                    (sum, drink) => sum + (drink.quantity || 0),
                                    0
                                )}{" "}
                                / {freeDessertsQuantity} {t("joinNow.meals.selected")}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {drinks.map((drink) => {
                                const remainingFreeDesserts =
                                    freeDessertsQuantity -
                                    Object.values(selectedFreeDesserts).reduce(
                                        (sum, d) => sum + (d.quantity || 0),
                                        0
                                    );
                                const canAddMore =
                                    remainingFreeDesserts > 0 ||
                                    selectedFreeDesserts[drink.id]?.quantity > 0;

                                return (
                                    <Card
                                        key={drink.id}
                                        className={`relative transition-shadow ${selectedFreeDesserts[drink.id]?.quantity > 0
                                                ? "ring-2 ring-green-400 bg-green-50"
                                                : "hover:shadow-lg"
                                            }`}
                                    >
                                        <div className="relative h-32 overflow-hidden rounded-t-lg">
                                            {drink.image_url || drink.image_path ? (
                                                <img
                                                    src={drink.image_url || drink.image_path || ""}
                                                    alt={drink.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2">
                                                <Badge className="bg-green-600 text-white">
                                                    {t("joinNow.meals.free")}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="p-4">
                                            <h4 className="font-semibold mb-1">{drink.name}</h4>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {drink.short_description || drink.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="text-xs text-muted-foreground">
                                                    {drink.calories || 0} {t("joinNow.meals.kcal")} •{" "}
                                                    {drink.protein || 0}g {t("joinNow.meals.protein")}
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 w-6 p-0 border-green-400 text-green-600 hover:bg-green-50"
                                                        onClick={() =>
                                                            handleFreeDessertQuantityChange(drink.id, -1)
                                                        }
                                                        disabled={!selectedFreeDesserts[drink.id]}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>

                                                    <span className="min-w-[1.5rem] text-center text-sm font-semibold text-green-700">
                                                        {selectedFreeDesserts[drink.id]?.quantity || 0}
                                                    </span>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 w-6 p-0 border-green-400 text-green-600 hover:bg-green-50"
                                                        onClick={() =>
                                                            handleFreeDessertQuantityChange(drink.id, 1)
                                                        }
                                                        disabled={!canAddMore}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
