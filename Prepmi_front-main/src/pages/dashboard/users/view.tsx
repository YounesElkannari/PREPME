import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Shield, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { webRoutes } from "@/routes/web";
import { handleErrorResponse } from "@/utils";
import { User } from "@/interfaces/admin";
import { RoleEnum } from "@/enum/RoleEnum";

const getRoleName = (roleId: number | undefined) => {
    if (roleId === undefined) return "Inconnu";
    switch (roleId) {
        case RoleEnum.ADMIN:
            return "Administrateur";
        case RoleEnum.CUISINIER:
            return "Cuisinier";
        case RoleEnum.LIVREUR:
            return "Livreur";
        case RoleEnum.CLIENT:
            return "Client";
        default:
            return "Inconnu";
    }
};

const getRoleColor = (roleId: number | undefined) => {
    if (roleId === undefined) return "bg-gray-400";
    switch (roleId) {
        case RoleEnum.ADMIN:
            return "bg-red-500";
        case RoleEnum.CUISINIER:
            return "bg-blue-500";
        case RoleEnum.LIVREUR:
            return "bg-green-500";
        case RoleEnum.CLIENT:
            return "bg-gray-500";
        default:
            return "bg-gray-400";
    }
};

export default function UserView() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            http.get(`${apiRoutes.users}/${id}`)
                .then((res) => {
                    setUser(res.data.data);
                })
                .catch((e) => {
                    handleErrorResponse(e);
                    setError(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-6xl flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement de l'utilisateur...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="container mx-auto p-6 max-w-6xl">
                <Alert variant="destructive">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        Impossible de charger les informations de l'utilisateur.
                    </AlertDescription>
                </Alert>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate(webRoutes.dashboard_users)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la liste
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(webRoutes.dashboard_users)}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour
                    </Button>
                    <h1 className="text-3xl font-bold">Profil utilisateur</h1>
                </div>
                <Button
                    onClick={() => navigate(`/dashboard/users/edit/${user.id}`)}
                >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Photo de profil</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-4">
                            {user.profile_image_url ? (
                                <img
                                    src={user.profile_image_url}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon className="w-16 h-16 text-gray-400" />
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-center">{user.name}</h2>
                        <Badge className={`mt-2 ${getRoleColor(user.role_id)}`}>
                            {getRoleName(user?.role_id)}
                        </Badge>
                        <Badge variant={user.is_active ? "default" : "secondary"} className="mt-2">
                            {user.is_active ? "Actif" : "Inactif"}
                        </Badge>
                        {user.email_verified_at && (
                            <Badge variant="outline" className="mt-2">
                                Email vérifié
                            </Badge>
                        )}
                    </CardContent>
                </Card>

                {/* Information Cards */}
                <div className="md:col-span-2 space-y-6">
                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations de contact</CardTitle>
                            <CardDescription>Coordonnées de l'utilisateur</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                            {user.phone && (
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Téléphone</p>
                                        <p className="font-medium">{user.phone}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    {(user.address || user.city || user.postal_code) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Adresse</CardTitle>
                                <CardDescription>Informations d'adresse</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                                    <div className="space-y-1">
                                        {user.address && <p className="font-medium">{user.address}</p>}
                                        {(user.city || user.postal_code) && (
                                            <p className="text-sm text-muted-foreground">
                                                {user.postal_code && `${user.postal_code} `}
                                                {user.city}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations du compte</CardTitle>
                            <CardDescription>Détails du compte utilisateur</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Shield className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Rôle</p>
                                    <p className="font-medium">{getRoleName(user.role_id)}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Date de création</p>
                                    <p className="font-medium">
                                        {new Date(user?.created_at || '').toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Dernière modification</p>
                                    <p className="font-medium">
                                        {new Date(user?.updated_at || '').toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            {user.email_verified_at && (
                                <>
                                    <Separator />
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email vérifié le</p>
                                            <p className="font-medium">
                                                {new Date(user.email_verified_at).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Account Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statut du compte</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <div>
                                        <p className="font-medium">
                                            {user.is_active ? 'Compte actif' : 'Compte inactif'}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {user.is_active
                                                ? 'L\'utilisateur peut se connecter et utiliser la plateforme'
                                                : 'L\'utilisateur ne peut pas se connecter'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
