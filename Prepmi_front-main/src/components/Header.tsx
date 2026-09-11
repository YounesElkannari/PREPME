import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { webRoutes } from "@/routes/web";
import { IconDashboard, IconLogin, IconMenu2 } from "@tabler/icons-react";
import { LangToggle } from "./lang-toggle";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import logo from "../assets/Prepme-simple.svg";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface RouteProps {
  href: string;
  label: string;
}

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const routeList: RouteProps[] = [
    {
      href: webRoutes.menu,
      label: t("menu_meals"),
    },
    {
      href: webRoutes.membership_plans,
      label: t("menu_plans"),
    },
    {
      href: webRoutes.for_teams,
      label: t("menu_for_teams"),
    },
    {
      href: webRoutes.for_collab,
      label: t("menu_for_collab"),
    },
  ];

  const admin = useSelector((state: RootState) => state.admin?.user);

  return (
    <header className="fixed left-1/2 -translate-x-1/2 z-50 mt-7 rounded-lg top-0 w-3/4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold flex items-center">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex text-center"
            >
              <img src={logo} alt="Prepme" className="h-16 w-auto" width="400" height="120" />
            </a>
          </span>
        </div>

        <nav className="hidden md:flex items-center">
          {routeList.map((route: RouteProps, i) => (
            <a
              href={route.href}
              key={i}
              className="text-sm font-medium hover:text-primary m-2 transition-colors"
            >
              {route.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <LangToggle />

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <IconMenu2 className="h-6 w-6" />
                <span className="sr-only">{t("menu_toggle", "Toggle menu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  <img src={logo} alt="Prepme" className="h-12 w-auto" />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-6">
                {routeList.map((route: RouteProps, i) => (
                  <a
                    href={route.href}
                    key={i}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium hover:text-primary py-2 px-2 hover:bg-accent rounded-md transition-colors"
                  >
                    {route.label}
                  </a>
                ))}
                <div className="border-t pt-4 space-y-3">
                  {admin?.id ? (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate(webRoutes.dashboard);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <IconDashboard className="mr-2 w-5 h-5" />
                      {t("menu_dashboard", "Dashboard")}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate(webRoutes.login);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <IconLogin className="mr-2 w-5 h-5" />
                      {t("menu_login")}
                    </Button>
                  )}
                  
                  {/* Mobile Get Started Button (Attractive Design) */}
                  <button
                    onClick={() => {
                      navigate(webRoutes.join_now);
                      setMobileMenuOpen(false);
                    }}
                    className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#b52e3a] to-secondary w-full py-3 text-sm font-bold text-white shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>{t("menu_get_started")}</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Connection & Admin Panel */}
          {admin?.id ? (
            <Button
              variant="ghost"
              className="hidden md:flex"
              onClick={() => {
                navigate(webRoutes.dashboard);
              }}
            >
              <IconDashboard className="mr-2 w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="hidden md:flex"
              onClick={() => {
                navigate(webRoutes.login);
              }}
            >
              <IconLogin className="mr-2 w-5 h-5" />
              <span className="hidden sm:inline">
                {t("menu_login")}
              </span>
            </Button>
          )}

          {/* Get Started (Desktop - Attractive Button with Hover & Arrow Animation) */}
          <button
            onClick={() => {
              navigate(webRoutes.join_now);
            }}
            className="hidden md:inline-flex relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#b52e3a] to-secondary px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 items-center gap-2"
          >
            <span className="absolute inset-0 w-full h-full bg-white/15 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative flex items-center gap-2">
              {t("menu_get_started")}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}