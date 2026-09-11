import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { webRoutes } from "@/routes/web";
import { RoleEnum } from "@/enum/RoleEnum";


export default function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        first_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        role: RoleEnum.CLIENT,
        address: "",
        city: "",
        postal_code: "",
        profile_image: "",
        status: true,
    });

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const roles = [
        { id: RoleEnum.ADMIN, name: "Administrateur" },
        { id: RoleEnum.CUISINIER, name: "Cuisinier" },
        { id: RoleEnum.LIVREUR, name: "Livreur" },
        { id: RoleEnum.CLIENT, name: "Client" },
    ];

    useEffect(() => {
        if (id) {
            setLoadingUser(true);
            http.get(`${apiRoutes.users}/${id}`)
                .then((res) => {
                    console.log("ss ", res.data);
                    const user = res.data;
                    setFormData({
                        first_name: user.first_name || "",
                        email: user.email || "",
                        password: "",
                        password_confirmation: "",
                        phone: user.phone || "",
                        role: user.role || RoleEnum.CLIENT,
                        address: user.address || "",
                        city: user.city || "",
                        postal_code: user.postal_code || "",
                        profile_image: user.profile_image || "",
                        status: user.status !== undefined ? user.status : true,
                    });

                    if (user.profile_image_url) {
                        setImagePreview(user.profile_image_url);
                    }
                })
                .catch((e) => {
                    handleErrorResponse(e);
                    setError(true);
                })
                .finally(() => {
                    setLoadingUser(false);
                });
        }
    }, [id]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
    };

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, profile_image: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        setError(false);
        setSuccess(false);
        setLoading(true);

        if (formData.first_name && formData.email && id) {
            const submitData = new FormData();

            Object.keys(formData).forEach((key) => {
                const value: any = formData[key as keyof typeof formData];

                if (key === 'profile_image' && value) {
                    submitData.append('profile_image', value);
                } else if (key === 'profile_image' && typeof value === 'string' && value) {
                    // Skip existing image path
                } else if (key === 'password' || key === 'password_confirmation') {
                    // Only include password if it's not empty
                    if (value) {
                        submitData.append(key, String(value));
                    }
                } else if (typeof value === 'boolean') {
                    submitData.append(key, value ? '1' : '0');
                } else if (value !== null && value !== undefined && key !== 'profile_image') {
                    submitData.append(key, String(value));
                }
            });

            submitData.append('_method', 'PUT');

            http.post(`${apiRoutes.users}/${id}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(() => {
                    setSuccess(true);
                    setTimeout(() => {
                        navigate(webRoutes.dashboard_users);
                    }, 2000);
                })
                .catch((e) => {
                    handleErrorResponse(e);
                    setError(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setError(true);
            setLoading(false);
        }
    };

    if (loadingUser) {
        return (
            <div className="container mx-auto p-6 max-w-4xl flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement de l'utilisateur...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(webRoutes.dashboard_users)}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Button>
                        <h1 className="text-3xl font-bold">Modifier l'utilisateur</h1>
                    </div>
                    <Button onClick={handleSubmit} loading={loading}>
                        Enregistrer les modifications
                    </Button>
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        Veuillez remplir tous les champs obligatoires (nom, email)
                    </AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 border-green-500 text-green-700">
                    <AlertTitle>Succès</AlertTitle>
                    <AlertDescription>
                        L'utilisateur a été modifié avec succès. Redirection en cours...
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Informations de l'utilisateur</CardTitle>
                    <CardDescription>Modifiez les informations de l'utilisateur</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Nom *</Label>
                            <Input name="first_name" value={formData.first_name} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Email *</Label>
                            <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Nouveau mot de passe</Label>
                            <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Laisser vide pour ne pas changer" />
                        </div>
                        <div>
                            <Label>Confirmer mot de passe</Label>
                            <Input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Téléphone</Label>
                            <Input name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Rôle</Label>
                            <Select
                                onValueChange={(value) => handleSelectChange("role", value)}
                                value={String(formData.role)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={String(role.id)}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2">
                            <Label>Adresse</Label>
                            <Input name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Ville</Label>
                            <Input name="city" value={formData.city} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Code postal</Label>
                            <Input name="postal_code" value={formData.postal_code} onChange={handleChange} />
                        </div>
                        <div className="col-span-2">
                            <Label>Photo de profil</Label>
                            <Input
                                type="file"
                                name="profile_image"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={imagePreview}
                                        alt="Aperçu"
                                        className="w-32 h-32 object-cover rounded-full border"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="col-span-2 flex items-center space-x-2">
                            <Switch
                                checked={formData.status}
                                onCheckedChange={(checked) => handleSwitchChange("status", checked)}
                            />
                            <Label>Actif</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
