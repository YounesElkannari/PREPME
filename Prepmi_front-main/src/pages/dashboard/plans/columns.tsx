import { Plan } from "@/interfaces/admin"
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
import { webRoutes } from "@/routes/web"

interface PlanColumnsProps {
    onDelete?: (id: number) => void;
}

export const columns = ({ onDelete }: PlanColumnsProps = {}): ColumnDef<Plan>[] => [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nom
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "meals_per_week",
        header: "Repas/semaine",
    },
    {
        accessorKey: "price_per_week",
        header: "Prix/semaine",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price_per_week") as string)
            return new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "MAD"
            }).format(price)
        }
    },
    {
        accessorKey: "delivery_fee",
        header: "Frais livraison",
        cell: ({ row }) => {
            const plan = row.original;
            if (plan.is_free_shipping) {
                return <Badge variant="secondary">Gratuite</Badge>
            }
            const fee = parseFloat(row.getValue("delivery_fee") as string)
            return new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "MAD"
            }).format(fee)
        }
    },
    {
        accessorKey: "is_active",
        header: "Statut",
        cell: ({ row }) => {
            const isActive = row.getValue("is_active")
            return (
                <Badge className={isActive ? "bg-green-500" : "bg-red-500"}>
                    {isActive ? "Actif" : "Inactif"}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const plan = row.original
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
                        <DropdownMenuItem onClick={() => navigate(webRoutes.dashboard_plans_view.replace(':id', String(plan.id)))}>
                            Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(webRoutes.dashboard_plans_edit.replace(':id', String(plan.id)))}>
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => onDelete?.(plan.id)}>
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
