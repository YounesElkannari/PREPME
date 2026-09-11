import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { handleErrorResponse, showNotification, NotificationType } from "@/utils";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";

interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog = ({ open, onOpenChange }: ChangePasswordDialogProps) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    const [errors, setErrors] = useState({
        old_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    const validateForm = () => {
        const newErrors = {
            old_password: '',
            new_password: '',
            new_password_confirmation: ''
        };

        if (!formData.old_password) {
            newErrors.old_password = t('profile.current_password_required', 'Current password is required');
        }

        if (!formData.new_password) {
            newErrors.new_password = t('profile.new_password_required', 'New password is required');
        } else if (formData.new_password.length < 8) {
            newErrors.new_password = t('profile.password_min_length', 'Password must be at least 8 characters');
        }

        if (!formData.new_password_confirmation) {
            newErrors.new_password_confirmation = t('profile.confirm_password_required', 'Please confirm your password');
        } else if (formData.new_password !== formData.new_password_confirmation) {
            newErrors.new_password_confirmation = t('profile.passwords_not_match', 'Passwords do not match');
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        http.post(apiRoutes.changePassword, formData)
            .then(() => {
                showNotification(
                    t('profile.password_changed_success', 'Password changed successfully!'),
                    NotificationType.SUCCESS
                );
                handleClose();
            })
            .catch(handleErrorResponse)
            .finally(() => setLoading(false));
    };

    const handleClose = () => {
        setFormData({
            old_password: '',
            new_password: '',
            new_password_confirmation: ''
        });
        setErrors({
            old_password: '',
            new_password: '',
            new_password_confirmation: ''
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        <DialogTitle>{t('profile.change_password', 'Change Password')}</DialogTitle>
                    </div>
                    <DialogDescription>
                        {t('profile.change_password_desc', 'Enter your current password and choose a new one')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="old_password">
                            {t('profile.current_password', 'Current Password')}
                        </Label>
                        <div className="relative">
                            <Input
                                id="old_password"
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={formData.old_password}
                                onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
                                className={errors.old_password ? 'border-red-500' : ''}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.old_password && (
                            <p className="text-sm text-red-500">{errors.old_password}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new_password">
                            {t('profile.new_password', 'New Password')}
                        </Label>
                        <div className="relative">
                            <Input
                                id="new_password"
                                type={showNewPassword ? 'text' : 'password'}
                                value={formData.new_password}
                                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                className={errors.new_password ? 'border-red-500' : ''}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.new_password && (
                            <p className="text-sm text-red-500">{errors.new_password}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new_password_confirmation">
                            {t('profile.confirm_password', 'Confirm New Password')}
                        </Label>
                        <div className="relative">
                            <Input
                                id="new_password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.new_password_confirmation}
                                onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
                                className={errors.new_password_confirmation ? 'border-red-500' : ''}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.new_password_confirmation && (
                            <p className="text-sm text-red-500">{errors.new_password_confirmation}</p>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            {t('profile.cancel', 'Cancel')}
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('profile.update_password', 'Update Password')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
