 import { useTranslation } from "react-i18next";

interface MealsHeaderProps {
    weeklyMenu: any;
}

export function MealsHeader({ weeklyMenu }: MealsHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
                {weeklyMenu?.title || t("joinNow.meals.title")}
            </h2>
            <p className="text-muted-foreground">
                {weeklyMenu?.description ||
                    t(
                        "joinNow.meals.subtitle"
                    )}
            </p>
      
        </div>
    );
}
