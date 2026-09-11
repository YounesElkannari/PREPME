import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslation } from "react-i18next"
import { Star, Quote, MapPin } from "lucide-react"

interface Review {
    name: string;
    city: string;
    rating: number;
    review: string;
    avatar: string;
    initials: string;
}

// Moroccan customer reviews
const mockReviews: Review[] = [
    {
        name: "Aicha Benali",
        city: "Casablanca",
        rating: 5,
        review: "reviews.review1",
        avatar: "",
        initials: "AB"
    },
    {
        name: "Youssef El Amrani",
        city: "Rabat",
        rating: 5,
        review: "reviews.review2",
        avatar: "",
        initials: "YE"
    },
    {
        name: "Fatima Zahra",
        city: "Marrakech",
        rating: 5,
        review: "reviews.review3",
        avatar: "",
        initials: "FZ"
    },

];

export function MoroccanReviews() {
    const { t } = useTranslation();

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? "fill-secondary text-secondary" : "text-gray-300"
                    }`}
            />
        ));
    };

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            {/* Background with primary/secondary colors */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'url(/zlig.png)',
                    backgroundRepeat: 'repeat',
                    backgroundSize: 'auto'
                }}
            >
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 dark:from-primary/5 dark:via-secondary/5 dark:to-primary/3"></div>

            <div className="container px-4 md:px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        <span className="text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full border border-primary/20 dark:border-primary/30">
                            {t('reviews.badge')}
                        </span>
                        <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-4 leading-tight">
                        {t('reviews.title')}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        {t('reviews.description')}
                    </p>
                </div>

                {/* Reviews Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {mockReviews.map((review, index) => (
                        <Card
                            key={index}
                            className="group relative bg-card/90 dark:bg-card/95 backdrop-blur-sm border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                        >
                            {/* Primary/Secondary accent border */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>

                            <CardContent className="p-6">
                                {/* Quote icon */}
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
                                        <Quote className="w-6 h-6 text-primary group-hover:text-secondary transition-colors duration-300" />
                                    </div>
                                </div>

                                {/* Review text */}
                                <blockquote className="text-muted-foreground group-hover:text-foreground text-center mb-6 leading-relaxed italic relative transition-colors duration-300">
                                    <span className="text-4xl text-primary/30 absolute -top-2 -left-2 font-serif">"</span>
                                    {t(review.review)}
                                    <span className="text-4xl text-secondary/30 absolute -bottom-4 -right-2 font-serif">"</span>
                                </blockquote>

                                {/* Rating */}
                                <div className="flex justify-center mb-4">
                                    <div className="flex space-x-1 p-2 bg-primary/5 rounded-full border border-primary/10">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>

                                {/* Customer info */}
                                <div className="flex items-center space-x-3">
                                    <Avatar className="border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                                        <AvatarImage src={review.avatar} alt={review.name} />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
                                            {review.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{review.name}</h4>
                                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                            <MapPin className="w-3 h-3 text-secondary" />
                                            <span>{review.city}, {t('reviews.morocco')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative corner */}
                                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                                    <svg width="24" height="24" viewBox="0 0 24 24" className="text-primary">
                                        <path fill="currentColor" d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                                    </svg>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Bottom decorative element */}
                <div className="mt-16 flex justify-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-12 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-8 h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full"></div>
                        <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                        <div className="w-12 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}