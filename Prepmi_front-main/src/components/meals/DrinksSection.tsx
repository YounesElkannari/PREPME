import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
 import { Coffee, Check, X, Plus, Minus, ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Meal } from "@/interfaces/admin";

interface DrinksSectionProps {
    drinks: Meal[];
    isLoadingDrinks: boolean;
    showDrinks: boolean;
    setShowDrinks: (show: boolean) => void;
    selectedDrinks: { [key: number]: Meal & { quantity: number } };
    handleDrinkQuantityChange: (itemId: number, change: number) => void;
}

export function DrinksSection({
    drinks,
    isLoadingDrinks,
    showDrinks,
    setShowDrinks,
    selectedDrinks,
    handleDrinkQuantityChange,
}: DrinksSectionProps) {
    const { t } = useTranslation('ns1');

    return (
        <Card className="border-2 border-dashed border-muted-foreground/30">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Coffee className="w-6 h-6 text-secondary" />
                    <div>
                        <CardTitle className="text-lg">
                            {t("joinNow.meals.addDrinks")}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {t("joinNow.meals.optionalHealthyBeverages")}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant={showDrinks ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowDrinks(true)}
                        className="flex items-center space-x-1"
                    >
                        <Check className="w-4 h-4" />
                        <span>{t("joinNow.meals.add")}</span>
                    </Button>
                    <Button
                        variant={!showDrinks ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowDrinks(false)}
                        className="flex items-center space-x-1"
                    >
                        <X className="w-4 h-4" />
                        <span>{t("joinNow.meals.skip")}</span>
                    </Button>
                </div>
            </CardHeader>

            {showDrinks && (
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {drinks.map((drink) => (
                                <Card
                                    key={drink.id}
                                    className="relative hover:shadow-lg transition-shadow"
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
                                    </div>

                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-1">{drink.name}</h4>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {drink.short_description || drink.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-muted-foreground">
                                                {drink.calories || 0} {t("joinNow.meals.kcal")} {t("joinNow.meals.separator")}{" "}
                                                {drink.protein || 0}{t("joinNow.meals.grams")} {t("joinNow.meals.protein")}
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => handleDrinkQuantityChange(drink.id, -1)}
                                                    disabled={!selectedDrinks[drink.id]}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>

                                                <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                                                    {selectedDrinks[drink.id]?.quantity || 0}
                                                </span>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => handleDrinkQuantityChange(drink.id, 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}
