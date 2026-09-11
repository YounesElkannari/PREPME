import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { User as UserIcon, Loader2, Upload } from "lucide-react";
import { User } from "@/interfaces/admin";
import { API_URL, handleErrorResponse, showNotification, NotificationType } from "@/utils";
import { setUser } from "@/store/slices/userSlice";
import axios from "axios";

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | undefined;
}

export const EditProfileDialog = ({ open, onOpenChange, user }: EditProfileDialogProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        company: ''
    });

    useEffect(() => {
        if (user && open) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                postal_code: user.postal_code || '',
                company: user.company || ''
            });
            setImagePreview(user.profile_image_url || user.profile_image || '');
        }
    }, [user, open]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();

            // Append all form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value) {
                    formDataToSend.append(key, value);
                }
            });

            // Append image if changed
            if (imageFile) {
                formDataToSend.append('profile_image', imageFile);
            }

            const response = await axios.post(
                `${API_URL}/user/update-profile`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Update user in Redux store
            if (response.data.user) {
                dispatch(setUser(response.data.user));
            }

            showNotification(
                t('profile.profile_updated_success', 'Profile updated successfully!'),
                NotificationType.SUCCESS
            );

            onOpenChange(false);
        } catch (error: any) {
            handleErrorResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setImageFile(null);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-primary" />
                        <DialogTitle>{t('profile.edit_profile', 'Edit Profile')}</DialogTitle>
                    </div>
                    <DialogDescription>
                        {t('profile.edit_profile_desc', 'Update your profile information')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Image */}
                    <div className="space-y-2">
                        <Label>{t('profile.profile_picture', 'Profile Picture')}</Label>
                        <div className="flex items-center gap-4">
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Profile preview"
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                            )}
                            <div className="flex-1">
                                <Input
                                    id="profile_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <Label
                                    htmlFor="profile_image"
                                    className="flex items-center gap-2 cursor-pointer px-4 py-2 border rounded-md hover:bg-accent w-fit"
                                >
                                    <Upload className="w-4 h-4" />
                                    {t('profile.upload_image', 'Upload Image')}
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">
                                {t('profile.first_name', 'First Name')}
                            </Label>
                            <Input
                                id="first_name"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">
                                {t('profile.last_name', 'Last Name')}
                            </Label>
                            <Input
                                id="last_name"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">
                            {t('profile.phone', 'Phone Number')}
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">
                            {t('profile.address', 'Address')}
                        </Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            rows={2}
                        />
                    </div>

                    {/* City and Postal Code */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="city">
                                {t('profile.city', 'City')}
                            </Label>
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="postal_code">
                                {t('profile.postal_code', 'Postal Code')}
                            </Label>
                            <Input
                                id="postal_code"
                                value={formData.postal_code}
                                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                        <Label htmlFor="company">
                            {t('profile.company', 'Company')} ({t('profile.optional', 'Optional')})
                        </Label>
                        <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
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
                            {t('profile.save_changes', 'Save Changes')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
