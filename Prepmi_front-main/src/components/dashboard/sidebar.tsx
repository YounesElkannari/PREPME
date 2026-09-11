import { useEffect, useState } from "react";
import { IconChevronsLeft, IconMenu2, IconRecycle, IconX } from "@tabler/icons-react";
import { Button } from "./custom/button";
import Nav from "./nav";
import { cn } from "@/lib/utils";
import { sidelinks } from "./data/sidelinks";
import { LayoutDashbord } from "./custom/LayoutDashbord";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { webRoutes } from "@/routes/web";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  className,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (navOpened) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [navOpened]);

  const role: number = useSelector((state: RootState) => state?.admin?.user?.role);
  const sidelinksVisible = sidelinks.filter((link: any) => link.role.includes(role));

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r border-slate-200 bg-white transition-[width] md:bottom-0 md:right-auto md:h-svh ${
          isCollapsed ? "md:w-14" : "md:w-64"
        }`,
        className
      )}
    >
      {/* Overlay mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 bg-black/50 transition-[opacity] delay-100 duration-500 md:hidden ${
          navOpened ? "h-svh opacity-100" : "h-0 opacity-0"
        }`}
      />

      <LayoutDashbord fixed className={navOpened ? "h-svh" : ""}>
        {/* Header */}
        <LayoutDashbord.Header
          sticky
          className="z-50 flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-white md:px-4"
        >
          <div className={`flex items-center ${!isCollapsed ? "gap-2.5" : ""}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <IconRecycle size={18} />
            </div>
            <a
              href={webRoutes.home}
              className={`flex flex-col justify-center truncate transition-all ${
                isCollapsed ? "invisible w-0 opacity-0" : "visible w-auto opacity-100"
              }`}
            >
              <span className="font-semibold text-sm text-slate-800 leading-tight">
                {t('website')}
              </span>
              <span className="text-[11px] text-slate-500">Business</span>
            </a>
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </Button>
        </LayoutDashbord.Header>

        {/* Navigation */}
        <Nav
          id="sidebar-menu"
          className={`z-40 h-full flex-1 overflow-auto ${
            navOpened ? "max-h-screen" : "max-h-0 py-0 md:max-h-screen md:py-2"
          }`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={sidelinksVisible}
          userRole={role}
        />

        {/* Collapse button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size="icon"
          variant="outline"
          className="absolute -right-3.5 top-1/2 z-50 hidden h-7 w-7 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50 md:inline-flex"
        >
          <IconChevronsLeft
            stroke={1.5}
            className={`h-4 w-4 text-slate-600 transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </Button>
      </LayoutDashbord>
    </aside>
  );
}