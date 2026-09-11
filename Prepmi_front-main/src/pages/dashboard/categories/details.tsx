import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { webRoutes } from "@/routes/web";
import { Category } from "@/interfaces/admin";
import { Badge } from "@/components/ui/badge";

const DetailItem = ({ label, value }: { label: string; value: any }) => (
    <div>
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p>{value || "-"}</p>
    </div>
);

export default function CategoryDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            // Fetch all categories and filter by ID (backend doesn't support GET /categories/{id})
            http.get(apiRoutes.categories)
                .then((res) => {
                    const categories = res.data.data || res.data;
                    const category = categories.find((cat: any) => cat.id?.toString() === id);
                    setCategory(category);
                })
                .catch(handleErrorResponse)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return <div className="container mx-auto p-6">Chargement des détails de la catégorie...</div>;
    }

    if (!category) {
        return <div className="container mx-auto p-6">Catégorie non trouvée.</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate(webRoutes.dashboard_categories)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <h1 className="text-3xl font-bold">{category.name}</h1>
                <Badge className={category.is_active ? "bg-green-500" : "bg-red-500"}>
                    {category.is_active ? "Actif" : "Inactif"}
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations de la catégorie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Nom" value={category.name} />
                        <DetailItem label="Slug" value={category.slug} />
                    </div>
                    
                    <div>
                        <p className="text-sm font-semibold text-muted-foreground">Description</p>
                        <p className="mt-1">{category.description || "-"}</p>
                    </div>

                    {category.image_url && (
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-2">Image</p>
                            <img 
                                src={category.image_url} 
                                alt={category.name} 
                                className="w-64 h-64 object-cover rounded-md border"
                            />
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/dashboard/categories/edit/${category.id}`)}
                        >
                            Modifier
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
