import { MembershipPlan } from "@/interfaces/admin"
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

export const columns: ColumnDef<MembershipPlan>[] = [
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
        accessorKey: "monthly_fee",
        header: "Frais mensuels",
        cell: ({ row }) => {
            const fee = parseFloat(row.getValue("monthly_fee") as string)
            return new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "MAD"
            }).format(fee)
        }
    },
    {
        accessorKey: "discount_percentage",
        header: "Réduction",
        cell: ({ row }) => {
            const discount = row.getValue("discount_percentage") as number
            return discount ? `${discount}%` : "-"
        }
    },
    {
        accessorKey: "delivery_slots",
        header: "Créneaux livraison",
        cell: ({ row }) => {
            const slots = row.getValue("delivery_slots") as number
            return slots || "-"
        }
    },
    {
        accessorKey: "includes_free_desserts",
        header: "Desserts gratuits",
        cell: ({ row }) => {
            const hasDesserts = row.getValue("includes_free_desserts")
            const plan = row.original
            if (hasDesserts) {
                return <Badge variant="secondary" className="text-white">{plan.free_desserts_quantity || 0} gratuit(s)</Badge>
            }
            return "-"
        }
    },
    {
        accessorKey: "free_delivery",
        header: "Livraison gratuite",
        cell: ({ row }) => {
            const freeDelivery = row.getValue("free_delivery")
            return freeDelivery ? <Badge variant="secondary">Oui</Badge> : <Badge variant="outline">Non</Badge>
        }
    },
    {
        accessorKey: "fixed_discount_amount",
        header: "Remise fixe",
        cell: ({ row }) => {
            const amount = row.getValue("fixed_discount_amount") as number
            return amount ? `${amount} MAD` : "-"
        }
    },
    {
        accessorKey: "has_premium_access",
        header: "Accès premium",
        cell: ({ row }) => {
            const hasPremium = row.getValue("has_premium_access")
            return hasPremium ? <Badge variant="secondary">Oui</Badge> : <Badge variant="outline">Non</Badge>
        }
    },
    {
        accessorKey: "premium_upgrade_fee_min",
        header: "Frais upgrade min",
        cell: ({ row }) => {
            const minFee = row.getValue("premium_upgrade_fee_min") as number
            return minFee ? `${minFee} MAD` : "-"
        }
    },
    {
        accessorKey: "premium_upgrade_fee_max",
        header: "Frais upgrade max",
        cell: ({ row }) => {
            const maxFee = row.getValue("premium_upgrade_fee_max") as number
            return maxFee ? `${maxFee} MAD` : "-"
        }
    },
    {
        accessorKey: "free_freezes_per_period",
        header: "Congélations gratuites",
        cell: ({ row }) => {
            const freezes = row.getValue("free_freezes_per_period") as number
            return freezes || 0
        }
    },
    {
        accessorKey: "freeze_period_months",
        header: "Période congélation",
        cell: ({ row }) => {
            const months = row.getValue("freeze_period_months") as number
            return months ? `${months} mois` : "-"
        }
    },
    {
        accessorKey: "cancellable_anytime",
        header: "Annulable anytime",
        cell: ({ row }) => {
            const cancellable = row.getValue("cancellable_anytime")
            return cancellable ? <Badge variant="secondary">Oui</Badge> : <Badge variant="outline">Non</Badge>
        }
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
                        <DropdownMenuItem onClick={() => navigate(webRoutes.dashboard_membership_plans_view.replace(':id', String(plan.id)))}>
                            Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(webRoutes.dashboard_membership_plans_edit.replace(':id', String(plan.id)))}>
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => alert(`Supprimer le plan ${plan.id}`)}>
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
