import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { Star, Quote } from "lucide-react";

interface Review {
  name: string;
  rating: number;
  review: string;
  avatar: string;
  initials: string;
}

const clientReviews: Review[] = [
  {
    name: "Sarah Johnson",
    rating: 5,
    review: "client_reviews.review1",
    avatar: "",
    initials: "SJ",
  },
  {
    name: "Ahmed Hassan",
    rating: 5,
    review: "client_reviews.review2",
    avatar: "",
    initials: "AH",
  },
  {
    name: "Maria Garcia",
    rating: 5,
    review: "client_reviews.review3",
    avatar: "",
    initials: "MG",
  },
];

export function ClientReviews() {
  const { t } = useTranslation();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-secondary text-secondary" : "text-white/30"
        }`}
      />
    ));
  };

  return (
    <section className="relative overflow-hidden bg-primary min-h-[600px] flex items-center py-16" style={{ contentVisibility: 'auto' }}>
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white uppercase mb-4">
            {t("client_reviews.title")}
          </h2>
          <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t("client_reviews.description")}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {clientReviews.map((review, index) => (
            <Card
              key={index}
              className="group relative bg-primary border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden rounded-xl"
            >
              {/* Thin red top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>

              <CardContent className="p-6">
                {/* Quote icon */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/15 transition-all duration-300">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Review text */}
                <blockquote className="text-white text-center mb-6 leading-relaxed italic relative">
                  <span className="text-4xl text-white/20 absolute -top-2 -left-2 font-serif">
                    "
                  </span>
                  {t(review.review)}
                  <span className="text-4xl text-white/20 absolute -bottom-4 -right-2 font-serif">
                    "
                  </span>
                </blockquote>

                {/* Rating */}
                <div className="flex justify-center mb-4">
                  <div className="flex space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>

                {/* Customer info */}
                <div className="flex items-center justify-center space-x-3">
                  <Avatar className="border-2 border-white/20">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback className="bg-white/20 text-white font-semibold">
                      {review.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">
                      {review.name}
                    </h4>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
