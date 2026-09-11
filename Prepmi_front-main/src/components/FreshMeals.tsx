import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, Heart, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

interface FeatureProps {
    icon: JSX.Element;
    title: string;
    description: string;
}

export function FreshMeals() {
    const { t } = useTranslation()

    const features: FeatureProps[] = [
        {
            icon: <Heart className="h-12 w-12 text-primary" />,
            title: t('fresh_meals.fresh_title'),
            description: t('fresh_meals.fresh_description')
        },
        {
            icon: <ChefHat className="h-12 w-12 text-primary" />,
            title: t('fresh_meals.chef_title'),
            description: t('fresh_meals.chef_description')
        },
        {
            icon: <Users className="h-12 w-12 text-primary" />,
            title: t('fresh_meals.dietitian_title'),
            description: t('fresh_meals.dietitian_description')
        }
    ]

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20 dark:from-background dark:to-muted/10 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 dark:bg-primary/3 rounded-full blur-3xl" />

            <div className="container px-4 md:px-6">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-block mb-6">
                        <span className="text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 px-4 py-2 rounded-full">
                            {t('fresh_meals.badge')}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                        {t('fresh_meals.main_title')}
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {t('fresh_meals.main_description')}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white group"
                        >
                            <CardHeader className="pb-4">
                                <div className="flex justify-center mb-6">
                                    <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                        {feature.icon}
                                    </div>
                                </div>
                                <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Bottom Accent */}
                <div className="mt-16 text-center">
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
                </div>
            </div>
        </section>
    )
}