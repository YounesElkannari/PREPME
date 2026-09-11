import { useTranslation } from "react-i18next";
import {
  IconPackages,
  IconToolsKitchen2,
  IconTruckDelivery,
  IconClipboardCheck,
} from "@tabler/icons-react";
import howItWorksBg from "@/assets/how-it-works-bg.jpg";

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { icon: IconPackages, key: "step1" },
    { icon: IconToolsKitchen2, key: "step2" },
    { icon: IconTruckDelivery, key: "step3" },
    { icon: IconClipboardCheck, key: "step4" },
  ];

  return (
    <section
      className="relative py-20 md:py-28 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${howItWorksBg})`,
      }}
    >
      <div className="absolute inset-0 bg-[#F7F5F0]/45" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Title */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 tracking-tight">
            {t("landing.how_it_works.title")}
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Desktop */}
          <div className="hidden md:block">
            <div className="absolute top-24 left-16 right-16 h-2 bg-gradient-to-r from-secondary via-primary to-secondary rounded-full -translate-y-1/2 shadow-lg" />

            <div className="flex justify-between items-stretch relative px-4 gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center relative z-10 w-64"
                  >
                    <div className="relative mb-6 shrink-0">
                      <div className="w-24 h-24 rounded-full bg-white/90 border-4 border-secondary/30 flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-md">
                        <Icon
                          size={40}
                          className="text-primary"
                          strokeWidth={2}
                        />
                      </div>

                      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-secondary text-white font-bold text-base flex items-center justify-center shadow-lg border-4 border-white">
                        {index + 1}
                      </div>
                    </div>

                    <div className="text-center bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex-1 w-full flex flex-col justify-start">
                      <h3 className="font-bold text-xl text-primary mb-3 leading-tight min-h-[3.5rem] flex items-center justify-center">
                        {t(`landing.how_it_works.${step.key}.title`)}
                      </h3>
                      <p className="text-base text-gray-600 leading-relaxed">
                        {t(`landing.how_it_works.${step.key}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex items-start gap-5 relative">
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 top-16 bottom-0 w-1 bg-gradient-to-b from-secondary via-primary to-secondary" />
                  )}

                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-white/90 border-4 border-secondary/30 flex items-center justify-center shadow-md">
                      <Icon
                        size={28}
                        className="text-primary"
                        strokeWidth={2}
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-secondary text-white font-bold text-sm flex items-center justify-center shadow-lg border-4 border-white">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1 bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-md border border-gray-100">
                    <h3 className="font-bold text-lg text-primary mb-2 leading-tight">
                      {t(`landing.how_it_works.${step.key}.title`)}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t(`landing.how_it_works.${step.key}.description`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}