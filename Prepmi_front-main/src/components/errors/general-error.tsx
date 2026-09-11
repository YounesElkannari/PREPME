import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { webRoutes } from "@/routes/web";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean;
}

export default function ErrorPage({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className={cn("h-svh w-full", className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {!minimal && (
          <h1 className="text-[7rem] font-bold leading-tight">{t('dashboard.error.general.title')}</h1>
        )}
        <span className="font-medium">{t('dashboard.error.general.message')}</span>
        <p className="text-center text-muted-foreground">
          {t('dashboard.error.general.description')}
        </p>
        {!minimal && (
          <div className="mt-6 flex gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              {t('dashboard.error.general.go_back')}
            </Button>
            <Button onClick={() => navigate(webRoutes.home)}>
              {t('dashboard.error.general.back_home')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
