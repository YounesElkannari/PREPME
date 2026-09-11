import { Button } from "@/components/ui/button"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { webRoutes } from "@/routes/web"
import logo from "../assets/Prepme.svg";


export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <img src={logo} alt="Prepme" className="h-10 mb-4" loading="lazy" />
            <p className="mb-6 text-muted-foreground">
              {t('footer.company_description')}
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{t('footer.delivery_info')}</p>
              <p>{t('footer.health_certified')}</p>
            </div>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('footer.quick_links')}</h3>
            <nav className="space-y-2 text-sm">
              <Link to="/" className="block transition-colors hover:text-primary">
                {t('menu_home')}
              </Link>
              <a href="#about" className="block transition-colors hover:text-primary">
                {t('menu_about')}
              </a>
              <a href="#how-it-works" className="block transition-colors hover:text-primary">
                {t('menu_how_it_works')}
              </a>
              <Link to={webRoutes.register} className="block transition-colors hover:text-primary">
                {t('footer.order_now')}
              </Link>
              <Link to={webRoutes.login} className="block transition-colors hover:text-primary">
                {t('menu_login')}
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('footer.meal_categories')}</h3>
            <nav className="space-y-2 text-sm">
              <a href="#" className="block transition-colors hover:text-primary">
                {t('footer.high_protein')}
              </a>
              <a href="#" className="block transition-colors hover:text-primary">
                {t('footer.vegetarian')}
              </a>
              <a href="#" className="block transition-colors hover:text-primary">
                {t('footer.keto_friendly')}
              </a>
              <a href="#" className="block transition-colors hover:text-primary">
                {t('footer.moroccan_classics')}
              </a>
              <a href="#" className="block transition-colors hover:text-primary">
                {t('footer.low_carb')}
              </a>
            </nav>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">{t('footer.contact_support')}</h3>
            <address className="space-y-3 text-sm not-italic mb-6">
              <p className="flex items-center space-x-2">
                <span>📍</span>
                <span>{t('footer.address')}</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>📞</span>
                <span>{t('footer.phone_number')}</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>✉️</span>
                <span>{t('footer.email_address')}</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>🕒</span>
                <span>{t('footer.hours')}</span>
              </p>
            </address>
            <div className="mb-6 flex space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:border-blue-300">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('footer.follow_facebook')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-pink-50 hover:border-pink-300">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('footer.follow_instagram')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:border-blue-400">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('footer.follow_linkedin')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              {/* <ThemeSwitcher type="checkbox" /> */}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </p>
          <nav className="flex flex-wrap gap-4 text-sm justify-center">
            <Link to={webRoutes.privacy_policy} className="transition-colors hover:text-primary">
              {t('footer.privacy_policy')}
            </Link>
            <Link to={webRoutes.terms_service} className="transition-colors hover:text-primary">
              {t('footer.terms_service')}
            </Link>
            <Link to={webRoutes.cookie_settings} className="transition-colors hover:text-primary">
              {t('footer.cookie_settings')}
            </Link>
            <a href="#" className="transition-colors hover:text-primary">
              {t('footer.faq')}
            </a>
          </nav>
        </div>
      </div>
      {/* <Button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
      >
        {isChatOpen ? "Close Chat" : "Open Chat"}
      </Button>
      {isChatOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 rounded-lg border bg-background p-4 shadow-lg">
          <h4 className="mb-4 text-lg font-semibold">Live Chat</h4>
          <div className="mb-4 h-40 overflow-y-auto rounded border p-2">
            <p className="mb-2">
              <strong>Support:</strong> Hello! How can I assist you today?
            </p>
          </div>
          <form className="flex gap-2">
            <Textarea placeholder="Type your message..." className="flex-grow" />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      )} */}
    </footer>
  )
}