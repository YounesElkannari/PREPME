import { DeliverySlot } from "@/interfaces/admin"
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

export const columns: ColumnDef<DeliverySlot>[] = [
    {
        accessorKey: "slot_name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nom du créneau
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "slot_type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("slot_type") as string;
            const typeMap: Record<string, string> = {
                'normal': 'Normal',
                'membership': 'Membership',
                'both': 'Les deux'
            };
            return <Badge variant="outline">{typeMap[type] || type}</Badge>;
        }
    },
    {
        accessorKey: "start_time",
        header: "Heure début",
    },
    {
        accessorKey: "end_time",
        header: "Heure fin",
    },
    {
        accessorKey: "day_of_week",
        header: "Jour",
        cell: ({ row }) => {
            const day = row.getValue("day_of_week");
            const daysMap: Record<number, string> = {
                0: 'Dimanche',
                1: 'Lundi',
                2: 'Mardi',
                3: 'Mercredi',
                4: 'Jeudi',
                5: 'Vendredi',
                6: 'Samedi'
            };
            return day !== null && day !== undefined ? daysMap[Number(day)] || String(day) : "Tous les jours";
        }
    },
    {
        accessorKey: "max_capacity",
        header: "Capacité max",
    },
    // {
    //     accessorKey: "current_bookings",
    //     header: "Réservations",
    //     cell: ({ row }) => {
    //         const current = row.getValue("current_bookings") as number || 0;
    //         const max = row.original.max_capacity;
    //         const percentage = (current / max) * 100;

    //         let colorClass = "bg-green-500";
    //         if (percentage >= 80) colorClass = "bg-red-500";
    //         else if (percentage >= 50) colorClass = "bg-yellow-500";

    //         return (
    //             <div className="flex items-center gap-2">
    //                 <span>{current}/{max}</span>
    //                 <Badge className={colorClass}>
    //                     {percentage.toFixed(0)}%
    //                 </Badge>
    //             </div>
    //         );
    //     }
    // },
    {
        accessorKey: "price_adjustment",
        header: "Ajust. prix",
        cell: ({ row }) => {
            const adjustment = parseFloat(row.getValue("price_adjustment") as string) || 0;
            if (adjustment === 0) return "-";

            return new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "MAD",
                signDisplay: "always"
            }).format(adjustment);
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
            const slot = row.original
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
                        <DropdownMenuItem onClick={() => navigate(webRoutes.dashboard_delivery_slots_view.replace(':id', String(slot.id)))}>
                            Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(webRoutes.dashboard_delivery_slots_edit.replace(':id', String(slot.id)))}>
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => alert(`Supprimer le créneau ${slot.id}`)}>
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
