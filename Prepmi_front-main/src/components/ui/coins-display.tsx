import { IconCoins } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useTranslation } from "react-i18next";

interface CoinsDisplayProps {
  showLabel?: boolean;
  className?: string;
}

export default function CoinsDisplay({ showLabel = true, className = "" }: CoinsDisplayProps) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const { t } = useTranslation();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <IconCoins className="w-4 h-4 text-yellow-500" />
      <span className="font-medium text-yellow-600">
        {currentUser?.coins || 0}
      </span>
      {showLabel && (
        <span className="text-sm text-gray-500">
          {t('checkout.coins.unit')}
        </span>
      )}
    </div>
  );
}
