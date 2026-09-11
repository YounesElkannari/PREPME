import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { webRoutes } from "@/routes/web"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { RoleEnum } from "@/enum/RoleEnum"

interface Membership {
    id: number
    user_id: number
    membership_plan_id: number
    status: string
    started_at: string
    next_billing_date: string
    cancelled_at?: string
    user?: any
    membership_plan?: any
}

interface ColumnActions {
    onActivate?: (id: number) => void
    onFreeze?: (id: number) => void
    onUnfreeze?: (id: number) => void
    onCancel?: (id: number) => void
}

const statusVariant: Record<string, string> = {
    active: "bg-green-500",
    pending: "bg-yellow-500",
    frozen: "bg-blue-500",
    cancelled: "bg-red-500",
}

export const columns = (actions?: ColumnActions): ColumnDef<Membership>[] => [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "user",
        header: "Member",
        cell: ({ row }) => {
            const user = row.original.user
            return user ? (
                <div>
                    <div className="font-medium">{user.name || user.email}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                </div>
            ) : "-"
        },
    },
    {
        accessorKey: "membership_plan",
        header: "Plan",
        cell: ({ row }) => {
            const plan = row.original.membership_plan
            return plan ? (
                <div>
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-gray-500">{plan.monthly_fee} MAD/mois</div>
                </div>
            ) : "-"
        },
    },
    {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge className={`capitalize ${statusVariant[status] || "bg-gray-500"}`}>
                    {status === "active" ? "active" :
                     status === "pending" ? "pending" :
                     status === "frozen" ? "frozen" :
                     status === "cancelled" ? "cancelled" : status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "started_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Start Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("started_at") as string
            return date ? new Date(date).toLocaleDateString("fr-FR") : "-"
        },
    },
    {
        accessorKey: "next_billing_date",
        header: "Next Billing",
        cell: ({ row }) => {
            const date = row.getValue("next_billing_date") as string
            return date ? new Date(date).toLocaleDateString("fr-FR") : "-"
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const membership = row.original
            const navigate = useNavigate()
            const status = membership.status
            const admin = useSelector((state: RootState) => state.admin?.user)
            const isAdmin = Number(admin?.role) === RoleEnum.ADMIN

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
                        <DropdownMenuItem
                            onClick={() => navigate(`${webRoutes.dashboard_memberships}/view/${membership.id}`)}
                        >
                            View details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        {status === "pending" && actions?.onActivate && isAdmin && (
                            <DropdownMenuItem onClick={() => actions.onActivate!(membership.id)}>
                                Activate membership
                            </DropdownMenuItem>
                        )}
                        
                        {status === "active" && actions?.onFreeze && (
                            <DropdownMenuItem onClick={() => actions.onFreeze!(membership.id)}>
                                freeze memebership
                            </DropdownMenuItem>
                        )}
                        
                        {status === "frozen" && actions?.onUnfreeze && (
                            <DropdownMenuItem onClick={() => actions.onUnfreeze!(membership.id)}>
                                Reactivate memebership
                            </DropdownMenuItem>
                        )}
                        
                        {(status === "active" || status === "frozen") && actions?.onCancel && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => actions.onCancel!(membership.id)}
                                    className="text-red-600"
                                >
                                    Cancel membership
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
