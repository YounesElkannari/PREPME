import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { webRoutes } from "@/routes/web";
import i18next from "i18next";

export default function EditMeal() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        // Basic info
        name: "",

        description: "",
        short_description: "",
        image_path: "",
        gallery_images: [],
        category_id: 1, // Menu Default
        type_id: 1,

        // Nutritional info
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fats: 0,
        fiber: 0,
        sodium: 0,
        sugar: 0,

        // Ingredients & preparation
        ingredients: "",
        allergens: "",
        preparation_instructions: "",
        storage_instructions: "",

        // Dietary restrictions
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        is_dairy_free: false,
        is_nut_free: false,
        is_keto: false,
        is_paleo: false,
        is_low_carb: false,
        is_high_protein: false,

        // Spice & difficulty
        is_spicy: false,
        spice_level: 1,
        difficulty_level: 1,

        // Timing
        prep_time_minutes: 0,
        cooking_time_minutes: 0,

        // Pricing & serving
        price: 0,
        cost_per_serving: 0,
        weight_grams: 0,
        serving_size: "",

        // Chef notes & availability
        chef_notes: "",
        available_from: "",
        available_to: "",
        is_active: true,
    } as any);

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMeal, setLoadingMeal] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

  
    const types = [
        { id: 1, name: 'Menus' },
        { id: 2, name: 'Breakfast' },
        { id: 3, name: 'Drinks' },
        { id: 4, name: 'Desserts' },
    ];

    // Fetch categories on component mount
    useEffect(() => {
        setLoadingCategories(true);
        http.get(apiRoutes.categories)
            .then((res) => {
                setCategories(res.data.data || res.data);
            })
            .catch((e) => {
                handleErrorResponse(e);
            })
            .finally(() => {
                setLoadingCategories(false);
            });
    }, []);

    // Fetch meal data on component mount
    useEffect(() => {
        if (id) {
            setLoadingMeal(true);
            http.get(`${apiRoutes.meals}/${id}`)
                .then((res) => {
                    const meal = res.data.data;

                    // Extract nutrition data from nested object
                    const nutrition = meal.nutrition || {};

                    // Extract dietary info from nested object
                    const dietaryInfo = meal.dietary_info || {};

                    // Extract preparation data from nested object
                    const preparation = meal.preparation || {};

                    // Convert ingredients array to string if needed
                    const ingredientsStr = Array.isArray(meal.ingredients)
                        ? meal.ingredients.join(', ')
                        : meal.ingredients || "";

                    // Convert allergens array to string if needed
                    const allergensStr = Array.isArray(meal.allergens)
                        ? meal.allergens.join(', ')
                        : meal.allergens || "";

                    setFormData({
                        name: meal.name || "",
                        description: meal.description || "",
                        short_description: meal.short_description || "",
                        image_path: meal.image_url || "",
                        gallery_images: meal.gallery_urls || [],
                        category_id: meal.category_id || 1,
                        type_id: meal.type_id || 1,
                        calories: parseFloat(nutrition.calories) || 0,
                        protein: parseFloat(nutrition.protein) || 0,
                        carbohydrates: parseFloat(nutrition.carbohydrates) || 0,
                        fats: parseFloat(nutrition.fats) || 0,
                        fiber: parseFloat(nutrition.fiber) || 0,
                        sodium: parseFloat(nutrition.sodium) || 0,
                        sugar: parseFloat(nutrition.sugar) || 0,
                        ingredients: ingredientsStr,
                        allergens: allergensStr,
                        preparation_instructions: preparation.instructions || "",
                        storage_instructions: preparation.storage_instructions || "",
                        is_vegetarian: dietaryInfo.is_vegetarian || false,
                        is_vegan: dietaryInfo.is_vegan || false,
                        is_gluten_free: dietaryInfo.is_gluten_free || false,
                        is_dairy_free: dietaryInfo.is_dairy_free || false,
                        is_nut_free: dietaryInfo.is_nut_free || false,
                        is_keto: dietaryInfo.is_keto || false,
                        is_paleo: dietaryInfo.is_paleo || false,
                        is_low_carb: dietaryInfo.is_low_carb || false,
                        is_high_protein: dietaryInfo.is_high_protein || false,
                        is_spicy: meal.is_spicy || false,
                        spice_level: meal.spice_level || 1,
                        difficulty_level: preparation.difficulty_level || 1,
                        prep_time_minutes: preparation.prep_time_minutes || 0,
                        cooking_time_minutes: preparation.cooking_time_minutes || 0,
                        price: parseFloat(meal.price) || 0,
                        cost_per_serving: parseFloat(meal.cost_per_serving) || 0,
                        weight_grams: meal.weight_grams || 0,
                        serving_size: meal.serving_size || "",
                        chef_notes: meal.chef_notes || "",
                        available_from: meal.available_from || "",
                        available_to: meal.available_to || "",
                        is_active: meal.is_active !== undefined ? meal.is_active : true,
                    });

                    // Set image preview if exists
                    if (meal.image_url) {
                        setImagePreview(meal.image_url);
                    }

                    // Set gallery previews if exists
                    if (meal.gallery_urls && Array.isArray(meal.gallery_urls)) {
                        console.log("meal.gallery_urls", meal.gallery_urls);
                        setGalleryPreviews(meal.gallery_urls);
                    }
                })
                .catch((e) => {
                    handleErrorResponse(e);
                    setError(true);
                })
                .finally(() => {
                    setLoadingMeal(false);
                });
        }
    }, [id]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData((prev: any) => ({ ...prev, [name]: checked }));
    };

    const handleSelectChange = (name: string, value: string) => {
        const numericFields = ['category_id', 'type_id', 'spice_level', 'difficulty_level'];
        const parsedValue = numericFields.includes(name) ? parseInt(value, 10) : value;
        setFormData((prev: any) => ({ ...prev, [name]: parsedValue }));
    };

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev: any) => ({ ...prev, image_path: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryChange = (e: any) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setFormData((prev: any) => ({ ...prev, gallery_images: files }));

            const previews: string[] = [];
            files.forEach((file: any, index) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    previews[index] = reader.result as string;
                    if (previews.length === files.length) {
                        setGalleryPreviews([...previews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSubmit = () => {
        console.log("formData", formData);
        setError(false);
        setSuccess(false);
        setLoading(true);
        if (formData.name && id) {
            // Create FormData for file upload
            const submitData = new FormData();

            // Append all form fields
            Object.keys(formData).forEach((key) => {
                const value = formData[key as keyof typeof formData];

                if (key === 'image_path' && value instanceof File) {
                    // Append the image file
                    submitData.append('image_path', value);
                } else if (key === 'image_path' && typeof value === 'string' && value) {
                    // Skip existing image path string (don't send if not changed)
                    // The backend will keep the existing image
                } else if (key === 'gallery_images' && Array.isArray(value)) {
                    // Append gallery images
                    value.forEach((file: any, index: number) => {
                        if (file instanceof File) {
                            submitData.append(`gallery_images[${index}]`, file);
                        }
                    });
                } else if (typeof value === 'boolean') {
                    // Convert boolean to 1 or 0 for backend
                    submitData.append(key, value ? '1' : '0');
                } else if (value !== null && value !== undefined && key !== 'image_path') {
                    // Append other fields
                    submitData.append(key, String(value));
                }
            });

            // Add _method for Laravel PUT request via POST with FormData
            submitData.append('_method', 'PUT');

            http.post(`${apiRoutes.meals}/${id}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(() => {
                    setSuccess(true);
                    setTimeout(() => {
                        navigate(webRoutes.dashboard_meals);
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

    if (loadingMeal) {
        return (
            <div className="container mx-auto p-6 max-w-6xl flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement du repas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-4 justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/dashboard/meals')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Button>
                        <h1 className="text-3xl font-bold">Modifier le repas</h1>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">

                        <Button onClick={handleSubmit} loading={loading}>
                            Enregistrer les modifications
                        </Button>
                    </div>

                </div>

            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        Veuillez remplir tous les champs obligatoires (nom, prix, description)
                    </AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 border-green-500 text-green-700">
                    <AlertTitle>Succès</AlertTitle>
                    <AlertDescription>
                        Le repas a été modifié avec succès. Redirection en cours...
                    </AlertDescription>
                </Alert>
            )}

            <div className="container mx-auto p-6 max-w-6xl">


                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic">Informations</TabsTrigger>
                        <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                        <TabsTrigger value="preparation">Préparation</TabsTrigger>
                        <TabsTrigger value="dietary">Régime</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations de base</CardTitle>
                                <CardDescription>Informations générales du repas</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Nom *</Label>
                                    <Input name="name" value={formData.name} onChange={handleChange} />
                                </div>

                                <div>
                                    <Label>Catégorie</Label>
                                    <Select
                                        onValueChange={(value) => handleSelectChange("category_id", value)}
                                        value={String(formData.category_id)}
                                        disabled={loadingCategories}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingCategories ? "Chargement..." : "Sélectionnez une catégorie"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.length > 0 ? (
                                                categories.map((category: any) => (
                                                    <SelectItem key={category.id} value={String(category.id)}>
                                                        {category.name[i18next.language] || category.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="0" disabled>Aucune catégorie disponible</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Type</Label>
                                    <Select
                                        onValueChange={(value) => handleSelectChange("type_id", value)}
                                        value={String(formData.type_id)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {types.map((type: any) => (
                                                <SelectItem key={type.id} value={String(type.id)}>
                                                    {type.name[i18next.language] || type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Prix</Label>
                                    <Input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" />
                                </div>
                                <div className="col-span-2">
                                    <Label>Description courte</Label>
                                    <Textarea
                                        name="short_description"
                                        value={formData.short_description}
                                        onChange={handleChange}
                                        rows={2}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>Description complète</Label>
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                    />
                                </div>
                                <div className="col-span-2 flex items-center space-x-2">
                                    <Switch
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                                    />
                                    <Label>Actif</Label>
                                </div>
                                <div>
                                    <Label>Image principale</Label>
                                    <Input
                                        type="file"
                                        name="image_path"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img
                                                src={imagePreview}
                                                alt="Aperçu"
                                                className="w-32 h-32 object-cover rounded-md border"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Label>Images galerie</Label>
                                    <Input
                                        type="file"
                                        name="gallery_images"
                                        onChange={handleGalleryChange}
                                        accept="image/*"
                                        multiple
                                    />
                                    {galleryPreviews.length > 0 && (
                                        <div className="mt-2 grid grid-cols-3 gap-2">
                                            {galleryPreviews.map((preview, index) => (
                                                <img
                                                    key={index}
                                                    src={preview}
                                                    alt={`Aperçu ${index + 1}`}
                                                    className="w-20 h-20 object-cover rounded-md border"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="nutrition" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations nutritionnelles</CardTitle>
                                <CardDescription>Valeurs nutritionnelles par portion</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Calories</Label>
                                    <Input type="number" name="calories" value={formData.calories} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Protéines (g)</Label>
                                    <Input type="number" name="protein" value={formData.protein} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Glucides (g)</Label>
                                    <Input type="number" name="carbohydrates" value={formData.carbohydrates} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Lipides (g)</Label>
                                    <Input type="number" name="fats" value={formData.fats} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Fibres (g)</Label>
                                    <Input type="number" name="fiber" value={formData.fiber} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Sodium (mg)</Label>
                                    <Input type="number" name="sodium" value={formData.sodium} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Sucre (g)</Label>
                                    <Input type="number" name="sugar" value={formData.sugar} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Poids (g)</Label>
                                    <Input type="number" name="weight_grams" value={formData.weight_grams} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Taille portion</Label>
                                    <Input name="serving_size" value={formData.serving_size} onChange={handleChange} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="preparation" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Préparation & Ingrédients</CardTitle>
                                <CardDescription>Instructions et informations de préparation</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Ingrédients</Label>
                                    <Textarea
                                        name="ingredients"
                                        value={formData.ingredients}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Liste des ingrédients..."
                                    />
                                </div>
                                <div>
                                    <Label>Allergènes</Label>
                                    <Input name="allergens" value={formData.allergens} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Instructions de préparation</Label>
                                    <Textarea
                                        name="preparation_instructions"
                                        value={formData.preparation_instructions}
                                        onChange={handleChange}
                                        rows={4}
                                    />
                                </div>
                                <div>
                                    <Label>Instructions de conservation</Label>
                                    <Textarea
                                        name="storage_instructions"
                                        value={formData.storage_instructions}
                                        onChange={handleChange}
                                        rows={2}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label>Temps préparation (min)</Label>
                                        <Input type="number" name="prep_time_minutes" value={formData.prep_time_minutes} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label>Temps cuisson (min)</Label>
                                        <Input type="number" name="cooking_time_minutes" value={formData.cooking_time_minutes} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label>Niveau de difficulté</Label>
                                        <Select
                                            onValueChange={(value) => handleSelectChange("difficulty_level", value)}
                                            value={String(formData.difficulty_level)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Facile</SelectItem>
                                                <SelectItem value="2">Moyen</SelectItem>
                                                <SelectItem value="3">Difficile</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={formData.is_spicy}
                                            onCheckedChange={(checked) => handleSwitchChange("is_spicy", checked)}
                                        />
                                        <Label>Plat épicé</Label>
                                    </div>
                                    {formData.is_spicy && (
                                        <div>
                                            <Label>Niveau épicé</Label>
                                            <Select
                                                onValueChange={(value) => handleSelectChange("spice_level", value)}
                                                value={String(formData.spice_level)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Doux</SelectItem>
                                                    <SelectItem value="2">Moyen</SelectItem>
                                                    <SelectItem value="3">Fort</SelectItem>
                                                    <SelectItem value="4">Très fort</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Label>Notes du chef</Label>
                                    <Textarea
                                        name="chef_notes"
                                        value={formData.chef_notes}
                                        onChange={handleChange}
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="dietary" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Restrictions alimentaires</CardTitle>
                                <CardDescription>Sélectionnez les régimes compatibles</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                {[
                                    { key: "is_vegetarian", label: "Végétarien" },
                                    { key: "is_vegan", label: "Vegan" },
                                    { key: "is_gluten_free", label: "Sans gluten" },
                                    { key: "is_dairy_free", label: "Sans lactose" },
                                    { key: "is_nut_free", label: "Sans noix" },
                                    { key: "is_keto", label: "Keto" },
                                    { key: "is_paleo", label: "Paleo" },
                                    { key: "is_low_carb", label: "Faible en glucides" },
                                    { key: "is_high_protein", label: "Riche en protéines" },
                                ].map(({ key, label }: any) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Switch
                                            checked={formData[key]}
                                            onCheckedChange={(checked) => handleSwitchChange(key, checked)}
                                        />
                                        <Label>{label}</Label>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>


            </div>
        </div>
    );
}
