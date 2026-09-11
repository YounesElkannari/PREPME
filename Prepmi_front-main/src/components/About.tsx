import { Card, CardContent } from "@/components/ui/card"
import { Heart, ChefHat, Users, MapPin, Sparkles, ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"

export function About() {
  const { t } = useTranslation()
  const [visibleSections, setVisibleSections] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = parseInt(entry.target.getAttribute('data-section') || '0')
            setVisibleSections(prev => [...prev, sectionIndex].filter((v, i, a) => a.indexOf(v) === i))
          }
        })
      },
      { threshold: 0.3 }
    )

    const sectionElements = document.querySelectorAll('[data-section]')
    sectionElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/50 dark:from-background dark:to-muted/20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 dark:bg-primary/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 dark:bg-secondary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        {/* Header */}
        <div
          data-section="0"
          className={`text-center mb-16 transition-all duration-1000 ${visibleSections.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              {t('about.badge')}
            </span>
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-4 leading-tight">
            {t('about.title')}
          </h2>
        </div>

        {/* Story Content */}
        <div className="max-w-4xl mx-auto">
          {/* Opening Story */}
          <div
            data-section="1"
            className={`mb-12 transition-all duration-1000 delay-200 ${visibleSections.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <Card className="bg-card/80 dark:bg-card/90 backdrop-blur-sm border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                      {t('about.story_opening')}
                    </p>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {t('about.story_problem')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Journey Story */}
          <div
            data-section="2"
            className={`mb-12 transition-all duration-1000 delay-400 ${visibleSections.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <Card className="bg-card/80 dark:bg-card/90 backdrop-blur-sm border border-border/50 hover:border-secondary/30 shadow-lg hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full">
                    <ChefHat className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                      {t('about.story_solution')}
                    </p>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {t('about.story_growth')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mission Story */}
          <div
            data-section="3"
            className={`mb-12 transition-all duration-1000 delay-600 ${visibleSections.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <Card className="bg-card/80 dark:bg-card/90 backdrop-blur-sm border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                      {t('about.story_mission')}
                    </p>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {t('about.story_future')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Values Grid */}
          <div
            data-section="4"
            className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-800 ${visibleSections.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <Card className="group bg-card/80 dark:bg-card/90 backdrop-blur-sm border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-300">{t('about.value1_title')}</h3>
                <p className="text-muted-foreground">{t('about.value1_desc')}</p>
              </CardContent>
            </Card>

            <Card className="group bg-card/80 dark:bg-card/90 backdrop-blur-sm border border-border/50 hover:border-secondary/30 shadow-lg hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-secondary transition-colors duration-300">{t('about.value2_title')}</h3>
                <p className="text-muted-foreground">{t('about.value2_desc')}</p>
              </CardContent>
            </Card>

            <Card className="group bg-card/80 dark:bg-card/90 backdrop-blur-sm border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-primary group-hover:text-secondary transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-300">{t('about.value3_title')}</h3>
                <p className="text-muted-foreground">{t('about.value3_desc')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Closing Message */}
          <div
            data-section="5"
            className={`text-center transition-all duration-1000 delay-1000 ${visibleSections.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 shadow-lg">
              <CardContent className="p-8">
                <p className="text-xl font-medium text-foreground mb-4">
                  {t('about.closing_message')}
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  {t('about.signature')}
                </p>
                <div className="flex justify-center">
                  <div className="flex items-center space-x-2 text-primary font-semibold">
                    <span>{t('about.team_name')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}