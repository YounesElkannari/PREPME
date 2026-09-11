import { useTranslation } from "react-i18next";

export function Why({ meals }: any) {
  const { t } = useTranslation();

  return (
    <div className="relative bg-mainbackground bg-center bg-cover bg-fixed">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      {/* SVG Wave Shape */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="w-full relative z-10"
        style={{ display: "block" }}
      >
        <path
          fill="#E8F5E9"
          fillOpacity="1"
          d="M0,224L60,229.3C120,235,240,245,360,250.7C480,256,600,256,720,229.3C840,203,960,149,1080,149.3C1200,149,1320,203,1380,229.3L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </svg>
      <section
        id="how-it-works"
        // className="relative py-20 bg-gradient-to-b from-[#e8e4e1] to-[#dbd7d6] overflow-hidden"
        className="relative py-20 overflow-hidden bg-[#E8F5E9] z-10"
        style={{ marginTop: "-1px" }}
      >
        {/* Additional scattered basil leaves */}
        <div
          className="absolute top-1/3 left-1/4 w-16 h-16 opacity-40 pointer-events-none z-0 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <svg
            viewBox="0 0 50 50"
            className="w-full h-full transform rotate-45"
          >
            <path
              d="M15,25 Q10,18 16,12 Q22,8 28,13 Q32,8 36,14 Q38,20 34,26 Q30,30 25,28 Q20,32 15,25 Z"
              fill="url(#leafGreen1)"
            />
            <defs>
              <linearGradient id="leafGreen1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div
          className="absolute top-1/2 right-1/4 w-20 h-20 opacity-40 pointer-events-none z-0 animate-float"
          style={{ animationDelay: "2s" }}
        >
          <svg
            viewBox="0 0 50 50"
            className="w-full h-full transform -rotate-12"
          >
            <path
              d="M15,25 Q10,18 16,12 Q22,8 28,13 Q32,8 36,14 Q38,20 34,26 Q30,30 25,28 Q20,32 15,25 Z"
              fill="url(#leafGreen2)"
            />
            <defs>
              <linearGradient id="leafGreen2">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-fade-up">
            {t("how_it_works.title")}
          </h2>
          <p
            className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            {t("how_it_works.description")}
          </p>
        </div>

        <div className="container mx-auto px-4 flex gap-4 items-stretch justify-center flex-wrap">
          {Array.isArray(meals) && meals.map((meal: any) => (
            <div
              key={meal.id}
              className="rounded-lg   flex flex-col p-4 items-center w-72 max-w-72"
            >
              <div className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 flex-shrink-0 relative">
                <img
                  src="./example4.png"
                  alt={meal.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/20 blur-md rounded-full"></div>
              </div>
              <h3 className="text-gray-900 text-center mt-4 font-semibold text-lg min-h-[3.5rem] flex items-center justify-center">
                {meal.name}
              </h3>
              <p className="text-gray-600 text-center text-sm mt-2 line-clamp-3">
                {meal.description}
              </p>
              {/* Show calories and protein */}
              <div className="flex space-x-4 mt-4 p-2">
                <span className="text-gray-700 text-sm">
                  {meal.nutrition.calories} {t("calories")}
                </span>
                <span className="text-gray-400 text-sm">|</span>
                <span className="text-gray-700 text-sm">
                  {meal.nutrition.protein}g {t("protein")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>{" "}

      {/* Footer SVG Wave with image in middle */}
      <div className="relative z-10 min-h-96" style={{ marginTop: '-1px' }}>
        {/* Meal image in the middle */}
        <div className="absolute left-1/2 -translate-x-1/2 md:top-[100px] top-[60px] -translate-y-1/2 z-20 pointer-events-none  h-72 w-72 md:h-96 md:w-96">
          <img
            src="./footer.png"
            alt="Meal decoration"
            className="  object-cover rounded-full    md:h-96 md:w-96 h-72 w-72  "
          />
        </div>

        {/* SVG Wave Shape for footer */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full relative"
          style={{ display: 'block', transform: 'rotate(180deg)' }}
        >
          <path
            fill="#E8F5E9"
            fillOpacity="1"
            d="M0,224L60,229.3C120,235,240,245,360,250.7C480,256,600,256,720,229.3C840,203,960,149,1080,149.3C1200,149,1320,203,1380,229.3L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>

    </div>
  );
}
