import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RootState } from "@/store";
import { register } from "@/store/slices/registerSlice";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import Cities from "@/data/cities.json";
import { useTranslation } from "react-i18next";
const PersonalInformation = () => {
    const dispatch = useDispatch();
    const data = useSelector((state: RootState) => state.register);

    const handleChange = (e: any) => {
        dispatch(register({ key: e.target.name, value: e.target.value }));
    }



    const { t } = useTranslation();

    return (
        <div className="flex flex-col space-y-4">
            {/* Company Logo Upload Section */}
            {/* <ImageUpload
                label={t('register.form.image')}
                value={data.company_logo}
                onChange={handleImageChange}
                placeholder="Drag and drop your company logo here, or"
                helperText="PNG, JPG, GIF up to 10MB"
                maxSize={10}
            /> */}
            <Label>
                {t('register.form.first')}
                <Input name="first_name"
                    onChange={(e: any) => handleChange(e)}
                    defaultValue={data.first_name}

                />
            </Label>
            <Label>
                {t('register.form.last')}
                <Input name="last_name" onChange={(e: any) => handleChange(e)}
                    defaultValue={data.last_name}

                />
            </Label>
            <Label>
                {t('register.form.phone')}
                <Input name="phone" type="tel"
                    onChange={(e) => handleChange(e)}
                    defaultValue={data.phone}

                />
            </Label>
            <Label>
                {t('register.form.email')}
                <Input name="email" type="email" onChange={(e: any) => handleChange(e)}
                    defaultValue={data.email}
                />
            </Label>
            <Label>
                {t('register.form.city')}
                <Select
                    name="city_id"
                    onValueChange={(e) => dispatch(register({ key: 'city_id', value: e }))}
                    defaultValue={data.city_id}
                >


                    <SelectTrigger >
                        <SelectValue placeholder={t('register.form.city')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{t('register.form.city')}</SelectLabel>

                            {Cities.map((city) => (
                                <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>
                            ))}

                        </SelectGroup>
                    </SelectContent>
                </Select>

            </Label >
            <Label>
                {t('register.form.adress')}
                <Input name="address" type="text" onChange={(e) => handleChange(e)}
                    defaultValue={data.address}
                />
            </Label>
            <Label>
                {t('register.form.password')}
                <Input name="password" type="password" onChange={(e) => handleChange(e)}
                    defaultValue={data.password}
                />
            </Label>
            <Label className="flex items-center space-x-2 mt-4">
                <Checkbox name="acceptTerms"
                    onCheckedChange={
                        (checked) => dispatch(register({ key: 'agreement', value: checked }))
                    }
                    defaultChecked={data?.agreement}
                />
                <span>
                    {t('register.form.terms')}{' '}
                    <a
                        href="/terms-of-service"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('register.form.terms_link')}
                    </a>
                </span>
            </Label>
        </div>
    );
}

export default PersonalInformation;