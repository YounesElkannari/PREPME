import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";

import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { useQuery } from "@tanstack/react-query";
import { IconFlame, IconMeat } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { webRoutes } from "@/routes/web";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { obfuscateId } from "@/lib/utils";
import { setSettings } from "@/store/slices/settingsSlice";

const ClientReviews = lazy(() =>
  import("@/components/ClientReviews").then((module) => ({ default: module.ClientReviews }))
);
const Footer = lazy(() => import("@/components/Footer"));
const ReferralDialog = lazy(() =>
  import("@/components/ReferralDialog").then((module) => ({ default: module.ReferralDialog }))
);

function useNearViewport(rootMargin = "500px") {
  const ref = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    if (!ref.current || isNearViewport) return;

    if (!("IntersectionObserver" in window)) {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isNearViewport, rootMargin]);

  return { ref, isNearViewport };
}

const Index = () => {
  const { t } = useTranslation();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector((state: RootState) => state.admin?.user);
  const isLoggedIn = !!(admin?.id && admin.id > 0);
  const [referralDialogOpen, setReferralDialogOpen] = useState(false);
  const settings = useSelector((state: RootState) => state.settings.settings);
  const videoRef = useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const { ref: mealsSectionRef, isNearViewport: shouldLoadMeals } = useNearViewport();
  const { ref: reviewsSectionRef, isNearViewport: shouldMountReviews } = useNearViewport();
  const { ref: footerSectionRef, isNearViewport: shouldMountFooter } = useNearViewport();

  const referralLink = isLoggedIn ? `${window.location.origin}/register?ref=${obfuscateId(admin.id!)}` : '';

  const youtubeVideo = settings?.find(s => s.key === 'youtube_explanation_video')?.value || 'https://www.youtube.com/embed/CRd8dHqU1AM?si=o3QPG9FPq-QEeL4c';

  // Fetch settings
  useQuery({
    queryKey: ["settings"],
    queryFn: () => http.get(apiRoutes.settings).then(res => {
      dispatch(setSettings(res.data.data || res.data));
      return res.data;
    }).catch(() => null),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Lazy load video when it comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVideoLoaded) {
            setIsVideoLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [isVideoLoaded]);

  useEffect(() => {
    // Check if popup was shown recently (within last 30 days)
    const lastShown = localStorage.getItem('prepmi_referral_popup_shown');
    const shouldShow = !lastShown || (Date.now() - parseInt(lastShown)) > (30 * 24 * 60 * 60 * 1000);

    if (shouldShow) {
      // Show dialog after a short delay for better UX
      const timer = setTimeout(() => {
        setReferralDialogOpen(true);
        localStorage.setItem('prepmi_referral_popup_shown', Date.now().toString());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCardClick = (mealId: number) => {
    navigator(webRoutes.meal_single.replace(':id', mealId.toString() || ''));
  };
  const {
    data: meals,
    isLoading: mealsLoading,
    isError: mealsError,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const res = await http.get(apiRoutes.meals, { timeout: 5000 }); // 5s timeout
      const mealsData = res.data.data || res.data;
      // Limit to first 3 meals for the slider
      return Array.isArray(mealsData) ? mealsData.slice(0, 3) : [];
    },
    // Start fetching earlier - reduce wait time
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true, // Fetch immediately instead of waiting for viewport
  });
  return (
    <main>
      <Hero />
      {/* How It Works Section */}
      <HowItWorks />

      {/* Meals display */}
      <section ref={mealsSectionRef} className="bg-primary py-16 md:py-20" style={{ contentVisibility: 'auto' }}>
        <div className="container mx-auto px-4 flex flex-col items-center">
          {/* Button */}
          <Button
            onClick={() => navigator(webRoutes.menu)}
            className="group relative mb-12 md:mb-16 overflow-hidden bg-secondary hover:bg-secondary text-white font-bold text-sm md:text-base px-10 py-6 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("see_all_menu")}
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Button>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full max-w-6xl">
            {!shouldLoadMeals || mealsLoading ? (
              <div className="col-span-full text-white text-lg py-12 text-center">
                {t("loading", "Loading meals...")}
              </div>
            ) : mealsError ? (
              <div className="col-span-full text-white text-lg py-12 text-center">
                {t("error_loading_meals", "Unable to load meals. Please try again later.")}
              </div>
            ) : meals && Array.isArray(meals) && meals.length > 0 ? (
              meals.map((meal: any, index: number) => (
                <div
                  key={meal.id}
                  onClick={() => handleCardClick(meal.id)}
                  className="group cursor-pointer flex flex-col items-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative w-full max-w-[260px] aspect-square mb-[-40px] z-10 transition-transform duration-300 group-hover:-translate-y-2">
                    <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20 bg-white/5">
                      <img
                        src={meal.image_url || "./example1.png"}
                        alt={meal.name}
                        loading="lazy"
                        decoding="async"
                        width={260}
                        height={260}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Card info */}
                  <div className="w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl pt-14 pb-5 px-5 text-center shadow-xl transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/25">
                    <h3 className="text-white font-semibold text-base md:text-lg leading-snug min-h-[3rem] flex items-center justify-center">
                      {meal.name}
                    </h3>

                    <div className="flex items-center justify-center gap-3 mt-3 text-sm text-white/85">
                      <span className="flex items-center gap-1">
                        {meal.nutrition?.calories ?? "—"} {t("calories", "calories")}
                        <IconFlame className="w-4 h-4 text-orange-400" />
                      </span>
                      <span className="text-white/40">|</span>
                      <span className="flex items-center gap-1">
                        {meal.nutrition?.protein ?? "—"}g {t("protein", "protein")}
                        <IconMeat className="w-4 h-4 text-red-400" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-white text-lg py-12 text-center">
                {t("no_meals_available", "No meals available at the moment.")}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <div className="container my-16 pt-8" ref={videoRef} style={{ contentVisibility: 'auto' }}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {t("landing.video_title", "SEE PREPME IN ACTION")}
          </h2>
          <p className="text-primary/80 text-lg max-w-2xl mx-auto">
            {t("landing.video_description", "Watch how we prepare your healthy meals and deliver them fresh to your door")}
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl bg-gray-100">
            {isVideoLoaded ? (
              <iframe
                src={youtubeVideo}
                title="PrepMe - Healthy Meals Made Easy"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                loading="lazy"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">Loading video...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div ref={reviewsSectionRef} style={{ minHeight: shouldMountReviews ? undefined : 600 }}>
        {shouldMountReviews && (
          <Suspense fallback={null}>
            <ClientReviews />
          </Suspense>
        )}
      </div>

      <div ref={footerSectionRef} style={{ minHeight: shouldMountFooter ? undefined : 360 }}>
        {shouldMountFooter && (
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        )}
      </div>

      {referralDialogOpen && (
        <Suspense fallback={null}>
          <ReferralDialog
            open={referralDialogOpen}
            onOpenChange={setReferralDialogOpen}
            isLoggedIn={isLoggedIn}
            referralLink={referralLink}
          />
        </Suspense>
      )}
    </main>
  );
};

export default Index;
