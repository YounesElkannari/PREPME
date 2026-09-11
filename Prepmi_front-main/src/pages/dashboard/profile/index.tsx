import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import {
    Mail,
    Phone,
    MapPin,
    Shield,
    Copy,
    Check,
    Lock,
    Calendar,
    Building,
    Coins
} from "lucide-react";
import { toast } from "sonner";
import { obfuscateId } from "@/lib/utils";
import { RoleEnum } from "@/enum/RoleEnum";
import { ChangePasswordDialog } from "./change-password-dialog";
import { EditProfileDialog } from "./edit-profile-dialog";

export default function ProfilePage() {
    const { t } = useTranslation();
    const currentUser = useSelector((state: RootState) => state.admin?.user);
    console.log("Current User:", currentUser);
    const [copiedReferral, setCopiedReferral] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const referralLink = currentUser?.id
        ? `${window.location.origin}/register?ref=${obfuscateId(currentUser.id)}`
        : '';

    const getRoleLabel = (roleId: number | undefined) => {
        if (!roleId) return t('profile.role_unknown', 'Unknown');
        switch (roleId) {
            case RoleEnum.ADMIN:
                return t('profile.role_admin', 'Administrator');
            case RoleEnum.CUISINIER:
                return t('profile.role_chef', 'Chef');
            case RoleEnum.LIVREUR:
                return t('profile.role_delivery', 'Delivery');
            case RoleEnum.CLIENT:
                return t('profile.role_client', 'Client');
            default:
                return t('profile.role_unknown', 'Unknown');
        }
    };

    const getRoleBadgeColor = (roleId: number | undefined) => {
        if (!roleId) return "secondary";
        switch (roleId) {
            case RoleEnum.ADMIN:
                return "destructive";
            case RoleEnum.CUISINIER:
                return "default";
            case RoleEnum.LIVREUR:
                return "secondary";
            case RoleEnum.CLIENT:
                return "outline";
            default:
                return "secondary";
        }
    };

    const copyReferralLink = () => {
        if (referralLink) {
            window.navigator.clipboard.writeText(referralLink);
            setCopiedReferral(true);
            toast.success(t('profile.referral_copied', 'Referral link copied to clipboard!'));
            setTimeout(() => setCopiedReferral(false), 2000);
        }
    };

    const getInitials = () => {
        if (currentUser?.first_name && currentUser?.last_name) {
            return `${currentUser.first_name.charAt(0)}${currentUser.last_name.charAt(0)}`.toUpperCase();
        }
        if (currentUser?.name) {
            return currentUser.name.substring(0, 2).toUpperCase();
        }
        return "U";
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return t('profile.not_available', 'N/A');
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{t('profile.title', 'My Profile')}</h1>
                    <p className="text-muted-foreground">
                        {t('profile.subtitle', 'Manage your account information and settings')}
                    </p>
                </div>
                {/* <Button onClick={() => setEditDialogOpen(true)} size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    {t('profile.edit_profile', 'Edit Profile')}
                </Button> */}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                            <Avatar className="w-32 h-32">
                                <AvatarImage src={currentUser?.profile_image_url || currentUser?.profile_image} />
                                <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle className="text-2xl">
                            {currentUser?.first_name || currentUser?.last_name
                                ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim()
                                : currentUser?.name || t('profile.no_name', 'No Name')
                            }
                        </CardTitle>
                        <CardDescription className="flex justify-center mt-2">
                            <Badge variant={getRoleBadgeColor(currentUser?.role)}>
                                <Shield className="w-3 h-3 mr-1" />
                                {getRoleLabel(currentUser?.role)}
                            </Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {currentUser?.coins !== undefined && (
                            <div className="flex items-center justify-center p-4 bg-primary/10 rounded-lg">
                                <Coins className="w-5 h-5 mr-2 text-primary" />
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">{t('profile.coins_balance', 'Coins Balance')}</p>
                                    <p className="text-2xl font-bold text-primary">{currentUser.coins}</p>
                                </div>
                            </div>
                        )}

                        {currentUser?.is_active && (
                            <div className="flex items-center justify-center">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <Check className="w-3 h-3 mr-1" />
                                    {t('profile.account_active', 'Account Active')}
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Information Cards */}
                <div className="md:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('profile.personal_info', 'Personal Information')}</CardTitle>
                            <CardDescription>
                                {t('profile.personal_info_desc', 'Your personal details and contact information')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground flex items-center">
                                        <Mail className="w-4 h-4 mr-2" />
                                        {t('profile.email', 'Email')}
                                    </Label>
                                    <Input
                                        value={currentUser?.email || ''}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground flex items-center">
                                        <Phone className="w-4 h-4 mr-2" />
                                        {t('profile.phone', 'Phone')}
                                    </Label>
                                    <Input
                                        value={currentUser?.phone || t('profile.not_set', 'Not set')}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>
                            </div>

                            {(currentUser?.address || currentUser?.city || currentUser?.postal_code) && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {t('profile.address', 'Address')}
                                        </Label>
                                        <Input
                                            value={currentUser?.address || ''}
                                            readOnly
                                            className="bg-muted"
                                        />
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <Input
                                                value={currentUser?.city || ''}
                                                placeholder={t('profile.city', 'City')}
                                                readOnly
                                                className="bg-muted"
                                            />
                                            <Input
                                                value={currentUser?.postal_code || ''}
                                                placeholder={t('profile.postal_code', 'Postal Code')}
                                                readOnly
                                                className="bg-muted"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {currentUser?.company && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground flex items-center">
                                            <Building className="w-4 h-4 mr-2" />
                                            {t('profile.company', 'Company')}
                                        </Label>
                                        <Input
                                            value={currentUser?.company || ''}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('profile.account_info', 'Account Information')}</CardTitle>
                            <CardDescription>
                                {t('profile.account_info_desc', 'Account status and dates')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {t('profile.member_since', 'Member Since')}
                                    </Label>
                                    <Input
                                        value={formatDate(currentUser?.created_at)}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {t('profile.last_updated', 'Last Updated')}
                                    </Label>
                                    <Input
                                        value={formatDate(currentUser?.updated_at)}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>
                            </div>

                            {currentUser?.email_verified_at && (
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground flex items-center">
                                        <Check className="w-4 h-4 mr-2 text-green-600" />
                                        {t('profile.email_verified', 'Email Verified')}
                                    </Label>
                                    <Input
                                        value={formatDate(currentUser?.email_verified_at)}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('profile.security', 'Security')}</CardTitle>
                            <CardDescription>
                                {t('profile.security_desc', 'Manage your password and security settings')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => setPasswordDialogOpen(true)}
                                variant="outline"
                                className="w-full md:w-auto"
                            >
                                <Lock className="w-4 h-4 mr-2" />
                                {t('profile.change_password', 'Change Password')}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Referral Link */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('profile.referral_program', 'Referral Program')}</CardTitle>
                            <CardDescription>
                                {t('profile.referral_desc', 'Share your referral link and earn rewards')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    value={referralLink}
                                    readOnly
                                    className="bg-muted"
                                />
                                <Button
                                    onClick={copyReferralLink}
                                    variant="outline"
                                    size="icon"
                                    className="flex-shrink-0"
                                >
                                    {copiedReferral ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t('profile.referral_info', 'Share this link with friends and earn coins when they sign up!')}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Dialogs */}
            <ChangePasswordDialog
                open={passwordDialogOpen}
                onOpenChange={setPasswordDialogOpen}
            />

            <EditProfileDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                user={currentUser}
            />
        </div>
    );
}
