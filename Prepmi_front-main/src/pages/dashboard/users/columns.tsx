import { User } from "@/interfaces/admin"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { RoleEnum } from "@/enum/RoleEnum"

const getRoleName = (roleId: number) => {
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

const getRoleColor = (roleId: number) => {
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

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "profile_image",
        header: "Photo",
        cell: ({ row }) => {
            const user: User = row.original
            return (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-semibold">
                        {user?.first_name ? user.first_name.charAt(0).toUpperCase() : '?'}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "first_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nom
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Téléphone",
        cell: ({ row }) => {
            const phone = row.getValue("phone") as string
            return phone || "-"
        }
    },
    {
        accessorKey: "role_id",
        header: "Rôle",
        cell: ({ row }) => {
            const user = row.original
            return (
                <Badge className={getRoleColor(user.role)}>
                    {getRoleName(user.role)}
                </Badge>
            )
        }
    },
    {
        accessorKey: "email_verified_at",
        header: "Email vérifié",
        cell: ({ row }) => {
            const verified = row.getValue("email_verified_at")
            return (
                <Badge variant={verified ? "default" : "secondary"}>
                    {verified ? "Vérifié" : "Non vérifié"}
                </Badge>
            )
        }
    },
    {
        accessorKey: "is_active",
        header: "Statut",
        cell: ({ row }) => {
            const user: User = row.original

            return (
                <Badge className={user.status ? "bg-green-500" : "bg-red-500"}>
                    {user.status ? "Actif" : "Inactif"}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original
            const navigate = useNavigate()

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/users/edit/${user.id}`)}>
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
