import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { handleErrorResponse } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { register as registerAction, restRegister } from "@/store/slices/registerSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { webRoutes } from "@/routes/web";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus, Mail, Lock, Phone, MapPin, User } from "lucide-react";
import Cities from "@/data/cities.json";
import { defaultHttp } from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { deobfuscateId } from "@/lib/utils";




const Register = () => {

    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const ref = searchParams.get('ref');
    const referrerId = ref ? deobfuscateId(ref) : null;
    const form = useSelector((state: RootState) => state.register)
    const navigator = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChange = (key: string, value: any) => {
        dispatch(registerAction({ key, value }));
    };

    const validateForm = () => {
        if (!form.first_name || !form.last_name) {
            toast.error("Please enter your first and last name");
            return false;
        }
        if (!form.email) {
            toast.error("Please enter your email address");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if (!form.password) {
            toast.error("Please enter a password");
            return false;
        }
        if (form.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }
        if (form.password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        if (!form.phone) {
            toast.error("Please enter your phone number");
            return false;
        }
        if (!form.agreement) {
            toast.error("Please accept the terms and conditions");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);



        defaultHttp.post(apiRoutes.register, {
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            address: form.address,
            city_id: form.city_id,
            zip_code: form.zip_code,
            country: form.country,
            agreement: form.agreement,
            referrer_id: referrerId,
        }).then(() => {
            toast.success("Account created successfully! Please login.");
            dispatch(restRegister());
            navigator(webRoutes.login);
        }).catch((error) => {
            setLoading(false);
            handleErrorResponse(error);
        });



    };


    return (
        <>

            <div className="container mx-auto py-10 mt-20">

                <div className="max-w-2xl mx-auto">
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="space-y-1 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <UserPlus className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold">{t('register.title', 'Create Account')}</CardTitle>
                            <CardDescription className="text-base">
                                {t('register.subtitle', 'Join us and start your healthy meal journey')}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name" className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            {t('register.form.first', 'First Name')} *
                                        </Label>
                                        <Input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            placeholder={t('register.form.firstPlaceholder', 'Enter your first name')}
                                            value={form.first_name}
                                            onChange={(e) => handleChange('first_name', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="last_name" className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            {t('register.form.last', 'Last Name')} *
                                        </Label>
                                        <Input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            placeholder={t('register.form.lastPlaceholder', 'Enter your last name')}
                                            value={form.last_name}
                                            onChange={(e) => handleChange('last_name', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {t('register.form.email', 'Email Address')} *
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder={t('register.form.emailPlaceholder', 'your.email@example.com')}
                                        value={form.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {t('register.form.phone', 'Phone Number')} *
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder={t('register.form.phonePlaceholder', '+212 6XX XXX XXX')}
                                        value={form.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        {t('register.form.password', 'Password')} *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder={t('register.form.passwordPlaceholder', 'Create a strong password')}
                                            value={form.password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                            required
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {t('register.form.passwordHint', 'Must be at least 6 characters')}
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        {t('register.form.confirmPassword', 'Confirm Password')} *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder={t('register.form.confirmPasswordPlaceholder', 'Re-enter your password')}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="pt-4 border-t">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        {t('register.form.addressSection', 'Delivery Address')} ({t('register.form.optional', 'Optional')})
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Address */}
                                        <div className="space-y-2">
                                            <Label htmlFor="address">
                                                {t('register.form.address', 'Street Address')}
                                            </Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                type="text"
                                                placeholder={t('register.form.addressPlaceholder', 'Enter your street address')}
                                                value={form.address}
                                                onChange={(e) => handleChange('address', e.target.value)}
                                            />
                                        </div>

                                        {/* City and Zip */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city_id">
                                                    {t('register.form.city', 'City')}
                                                </Label>
                                                <Select
                                                    value={form.city_id}
                                                    onValueChange={(value) => handleChange('city_id', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('register.form.selectCity', 'Select a city')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Cities.map((city) => (
                                                            <SelectItem key={city.id} value={city.id.toString()}>
                                                                {city.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="zip_code">
                                                    {t('register.form.zipCode', 'Zip Code')}
                                                </Label>
                                                <Input
                                                    id="zip_code"
                                                    name="zip_code"
                                                    type="text"
                                                    placeholder={t('register.form.zipPlaceholder', '20000')}
                                                    value={form.zip_code}
                                                    onChange={(e) => handleChange('zip_code', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Country */}
                                        <div className="space-y-2">
                                            <Label htmlFor="country">
                                                {t('register.form.country', 'Country')}
                                            </Label>
                                            <Input
                                                id="country"
                                                name="country"
                                                type="text"
                                                placeholder={t('register.form.countryPlaceholder', 'Morocco')}
                                                value={form.country || 'Morocco'}
                                                onChange={(e) => handleChange('country', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="agreement"
                                        checked={form.agreement}
                                        onCheckedChange={(checked) => handleChange('agreement', checked)}
                                    />
                                    <label
                                        htmlFor="agreement"
                                        className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {t('register.form.agreement', 'I agree to the')}{' '}
                                        <a href={webRoutes.terms_service} className="text-primary hover:underline">
                                            {t('register.form.terms', 'Terms and Conditions')}
                                        </a>
                                        {' '}{t('register.form.and', 'and')}{' '}
                                        <a href={webRoutes.privacy_policy} className="text-primary hover:underline">
                                            {t('register.form.privacy', 'Privacy Policy')}
                                        </a>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-lg font-semibold"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            {t('register.form.creating', 'Creating Account...')}
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5 mr-2" />
                                            {t('register.form.submit', 'Create Account')}
                                        </>
                                    )}
                                </Button>

                                {/* Login Link */}
                                <div className="text-center text-sm text-muted-foreground">
                                    {t('register.form.haveAccount', 'Already have an account?')}{' '}
                                    <a href={webRoutes.login} className="text-primary font-semibold hover:underline">
                                        {t('register.form.login', 'Login here')}
                                    </a>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>


            </div >
        </>

    );
};

export default Register;










