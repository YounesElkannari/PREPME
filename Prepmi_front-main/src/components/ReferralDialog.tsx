import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Share2, Users } from "lucide-react";
import { IconBrandWhatsapp, IconBrandMessenger, IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { webRoutes } from "@/routes/web";
import { useNavigate } from "react-router-dom";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";

interface ReferralDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoggedIn: boolean;
  referralLink: string;
}

export const ReferralDialog = ({ open, onOpenChange, isLoggedIn, referralLink }: ReferralDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const trackShare = async () => {
    if (isLoggedIn) {
      try {
        await http.post(apiRoutes.referral_track_share);
      } catch (error) {
        // Silently fail - don't block share action
        console.error('Failed to track share:', error);
      }
    }
  };

  const shareToWhatsApp = async () => {
    await trackShare();
    const message = t('landing.referral_message', `Join PrepMe and enjoy healthy meals! Use my referral link: ${referralLink}`);
    // Mobile-friendly WhatsApp sharing
    const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
    if (isMobile) {
      // Open WhatsApp app directly on mobile
      window.location.href = `whatsapp://send?text=${encodeURIComponent(message)}`;
    } else {
      // Desktop: use WhatsApp Web
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const shareToMessenger = async () => {
    await trackShare();
    // Mobile-friendly Messenger sharing
    const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
    if (isMobile) {
      // Try to open Messenger app with deep link
      window.location.href = `fb-messenger://share/?link=${encodeURIComponent(referralLink)}`;
    } else {
      // Desktop: copy link and notify user
      window.navigator.clipboard.writeText(referralLink);
      toast.success(t('landing.messenger_copy', 'Link copied! You can now paste it in Messenger.'));
    }
  };

  const shareToInstagram = async () => {
    await trackShare();
    // Copy link first
    window.navigator.clipboard.writeText(referralLink);

    // Mobile-friendly Instagram sharing
    const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
    if (isMobile) {
      // Try to open Instagram app
      window.location.href = 'instagram://app';
      // Show toast after a brief delay
      setTimeout(() => {
        toast.success(t('landing.instagram_copy', 'Link copied! You can now paste it in your Instagram bio or stories.'));
      }, 500);
    } else {
      toast.success(t('landing.instagram_copy', 'Link copied! You can now paste it in your Instagram bio or stories.'));
    }
  };

  const shareToLinkedIn = async () => {
    await trackShare();
    // Mobile-friendly LinkedIn sharing
    const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
    if (isMobile) {
      // Try to open LinkedIn app on mobile
      window.location.href = `linkedin://sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
    } else {
      // Desktop: use web sharing
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, '_blank');
    }
  };

  const copyToClipboard = async () => {
    await trackShare();
    window.navigator.clipboard.writeText(referralLink);
    toast.success(t('landing.link_copied', 'Link copied to clipboard!'));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-primary" />
            <DialogTitle>
              {isLoggedIn
                ? t('landing.referral_popup_title', 'Earn Points with Referrals!')
                : t('landing.referral_popup_title_guest', 'Join and Earn Points!')
              }
            </DialogTitle>
          </div>
          <DialogDescription>
            {isLoggedIn
              ? t('landing.referral_popup_desc', 'Share your referral link and earn points with each share action. Reach the threshold to get free meal credits!')
              : t('landing.referral_popup_desc_guest', 'Connect your account and start earning points by sharing your referral link with friends!')
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Share2 className="w-4 h-4" />
                <p>{t('landing.referral_link_label', 'Your referral link:')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-md text-sm bg-muted"
                />
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Share2 className="w-4 h-4" />
                  {t('landing.copy_link', 'Copy')}
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('landing.share_on_social', 'Share on social media:')}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={shareToWhatsApp}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <IconBrandWhatsapp className="w-5 h-5 text-green-600" />
                    {t('landing.whatsapp', 'WhatsApp')}
                  </Button>
                  <Button
                    onClick={shareToMessenger}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <IconBrandMessenger className="w-5 h-5 text-blue-600" />
                    {t('landing.messenger', 'Messenger')}
                  </Button>
                  <Button
                    onClick={shareToInstagram}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <IconBrandInstagram className="w-5 h-5 text-pink-600" />
                    {t('landing.instagram', 'Instagram')}
                  </Button>
                  <Button
                    onClick={shareToLinkedIn}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <IconBrandLinkedin className="w-5 h-5 text-blue-700" />
                    {t('landing.linkedin', 'LinkedIn')}
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="w-4 h-4" />
                <p>{t('landing.referral_note', 'Share your link to earn points. Each share action adds points to your balance.')}</p>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8 text-primary" />
                </div>
              </div>
              <p className="text-sm">{t('landing.referral_benefits', 'Get rewarded for every friend you bring to PrepMe!')}</p>
              <Button
                onClick={() => navigate(webRoutes.login)}
                className="w-full"
              >
                {t('landing.connect_now', 'Connect Now')}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
