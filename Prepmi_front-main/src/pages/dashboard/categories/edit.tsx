import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { ArrowLeft } from "lucide-react";
import { webRoutes } from "@/routes/web";

export default function EditCategory() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        image: "",
        is_active: true,
    });

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setLoadingCategory(true);
            // Fetch all categories and filter by ID (backend doesn't support GET /categories/{id})
            http.get(apiRoutes.categories)
                .then((res) => {
                    const categories = res.data.data || res.data;
                    const category = categories.find((cat: any) => cat.id?.toString() === id);
                    
                    if (category) {
                        setFormData({
                            name: category.name || "",
                            slug: category.slug || "",
                            description: category.description || "",
                            image: category.image_url || "",
                            is_active: category.is_active !== undefined ? category.is_active : true,
                        });

                        if (category.image_url) {
                            setImagePreview(category.image_url);
                        }
                    } else {
                        setError(true);
                    }
                })
                .catch((e) => {
                    handleErrorResponse(e);
                    setError(true);
                })
                .finally(() => {
                    setLoadingCategory(false);
                });
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Auto-generate slug from name
        if (name === "name") {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, is_active: checked }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file as any }));

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

        if (formData.name && formData.slug && id) {
            const submitData = new FormData();

            Object.keys(formData).forEach((key) => {
                const value = formData[key as keyof typeof formData];

                if (key === 'image' && value && typeof value === 'object' && 'name' in value) {
                    submitData.append('image', value as File);
                } else if (key === 'image' && typeof value === 'string' && value) {
                    // Don't append the old image URL, backend will keep it
                } else if (typeof value === 'boolean') {
                    submitData.append(key, value ? '1' : '0');
                } else if (value !== null && value !== undefined && key !== 'image') {
                    submitData.append(key, String(value));
                }
            });

            submitData.append('_method', 'PUT');

            http.post(`${apiRoutes.categories}/${id}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(() => {
                    setSuccess(true);
                    setTimeout(() => {
                        navigate(webRoutes.dashboard_categories);
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

    if (loadingCategory) {
        return (
            <div className="container mx-auto p-6 max-w-4xl flex items-center justify-center min-h-screen">
                <p>Chargement de la catégorie...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(webRoutes.dashboard_categories)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <h1 className="text-3xl font-bold">Modifier la catégorie</h1>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        Veuillez remplir tous les champs obligatoires (nom, slug)
                    </AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 border-green-500 text-green-700">
                    <AlertTitle>Succès</AlertTitle>
                    <AlertDescription>
                        La catégorie a été modifiée avec succès. Redirection en cours...
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Informations de la catégorie</CardTitle>
                    <CardDescription>Modifiez les informations de la catégorie</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom *</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ex: Breakfast, Lunch, Dinner..."
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                            id="slug"
                            name="slug"
                            placeholder="breakfast-lunch-dinner"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                        />
                        <p className="text-sm text-muted-foreground">
                            URL-friendly version du nom (généré automatiquement)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Décrivez la catégorie..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Image</Label>
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-md"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="is_active">Statut actif</Label>
                            <p className="text-sm text-muted-foreground">
                                La catégorie sera visible sur le site
                            </p>
                        </div>
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={handleSwitchChange}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate(webRoutes.dashboard_categories)}
                        >
                            Annuler
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Modification en cours..." : "Modifier la catégorie"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
