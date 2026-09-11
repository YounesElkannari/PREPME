import { webRoutes } from "@/routes/web";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconStar, IconTruck } from "@tabler/icons-react";

export function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#0f3318] min-h-[640px] flex items-center">
      <style>{`
        /* الصورة: من اليسار + دوران، وتستقر كبيرة ومائلة فـ نفس الحركة */
        @keyframes heroBoxIn {
          0% {
            opacity: 0;
            transform: translateX(-55%) rotate(-150deg) scale(0.75);
          }
          100% {
            opacity: 1;
            transform: translateX(0) rotate(-28deg) scale(1.45);
          }
        }

        /* النص: من اليمين لليسار، بلا دوران */
        @keyframes heroTextIn {
          0% {
            opacity: 0;
            transform: translateX(60px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .hero-box-anim {
          animation: heroBoxIn 2.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
          transform-origin: center center;
          will-change: transform, opacity;
        }

        .hero-text-anim {
          animation: heroTextIn 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both;
        }

        @media (max-width: 1023px) {
          @keyframes heroBoxInMobile {
            0% {
              opacity: 0;
              transform: translateX(-30%) rotate(-100deg) scale(0.85);
            }
            100% {
              opacity: 1;
              transform: translateX(0) rotate(-12deg) scale(1.15);
            }
          }
          .hero-box-anim {
            animation: heroBoxInMobile 2.1s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-10 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container relative z-10 px-4 py-14 md:py-20">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          {/* Image من اليسار */}
          <div className="order-1 flex justify-center overflow-visible lg:order-2 lg:justify-end">
            <div className="relative w-full max-w-xl lg:max-w-none lg:w-[120%]">
              <img
                src="/hero.png"
                alt={t("hero_alt_text", "Repas PrepMe")}
                loading="eager"
                fetchPriority="high"
                className="hero-box-anim h-auto w-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Text من اليمين → يستقر يسار */}
          <div className="hero-text-anim order-2 relative z-20 space-y-6 text-center lg:order-1 lg:space-y-8 lg:text-left">
            <h1 className="text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              {t("hero_title", "Repas sains livrés")}
            </h1>

            <p className="mx-auto max-w-xl text-base leading-relaxed text-white/80 md:text-lg lg:mx-0">
              {t(
                "hero_subtitle",
                "Choisissez votre box, composez vos repas de la semaine et recevez-les à domicile. Simple, sain, sans perte de temps."
              )}
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <button
                className="rounded-md bg-[#b52e3a] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#9a2530]"
                onClick={() => navigate(webRoutes.join_now)}
              >
                {t("hero_get_started", "Commencer")}
              </button>

              <button
                className="rounded-md border border-white/25 bg-white/5 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
                onClick={() => navigate(webRoutes.menu)}
              >
                {t("see_all_menu", "Voir le menu")}
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 text-sm text-white/75 sm:flex-row sm:justify-center lg:justify-start lg:gap-6">
              <span className="inline-flex items-center gap-2">
                <IconTruck size={18} />
                {t("hero_trust_delivery", "Livraison à domicile")}
              </span>
              <span className="inline-flex items-center gap-2">
                <IconStar size={18} className="text-yellow-300" />
                {t("hero_trust_menu", "Menus rotatifs chaque semaine")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
