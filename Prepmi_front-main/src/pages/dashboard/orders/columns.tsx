import { Order } from "@/interfaces/admin"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
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
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { RoleEnum } from "@/enum/RoleEnum"
import { useTranslation } from "react-i18next"

const statusVariant: any = {
    pending: "bg-yellow-500",
    preparing: "bg-blue-500",
    shipped: "bg-indigo-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
};

export const columns = (
    onAnnuleCommande?: (orderId: number) => Promise<void>
): ColumnDef<Order>[] => {
    const { t } = useTranslation();
    
    return [
        {
            accessorKey: "num_order",
            header: t('dashboard.orders.order_number'),
        },
        {
            accessorKey: "first_name",
            header: t('dashboard.orders.customer'),
            cell: ({ row }: any) => {
                return `${row.original.first_name} ${row.original.last_name}`
            }
        },
        {
            accessorKey: "phone",
            header: t('dashboard.orders.phone'),
        },
        {
            accessorKey: "adresse_livrsion",
            header: t('dashboard.orders.delivery_address'),
        },
        {
            accessorKey: "method_payement",
            header: t('dashboard.orders.payment_method'),
        },
        {
            accessorKey: "reward_point",
            header: t('dashboard.orders.loyalty_points'),
        },
        {
            accessorKey: "total_amount",
            header: t('dashboard.orders.total_amount'),
            cell: ({ row }) => {
                const amount = row.getValue("total_amount") as number;
                return amount ? `${amount} MAD` : "-";
            }
        },
        {
            accessorKey: "statue",
            header: t('dashboard.orders.status'),
            cell: ({ row }) => {
                const status = row.getValue("statue") as string;
                return (
                    <Badge className={`capitalize ${statusVariant[status] || "bg-gray-500"}`}>
                        {status}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "date_order",
            header: t('dashboard.orders.order_date'),
            cell: ({ row }) => {
                const date = row.getValue("date_order") as string;
                return new Date(date).toLocaleDateString('fr-FR');
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const order = row.original
                const navigate = useNavigate()
                const userRole = useSelector((state: RootState) => state.admin?.user?.role)
                console.log("User role:", userRole);
                const isClient = userRole === RoleEnum.CLIENT
                const isCancelled = (order as any)?.statue === "Cancelled"
                const isPending = (order as any)?.statue === "Pending"

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('dashboard.orders.actions')}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate(webRoutes.dashboard_orders_view.replace(":id", order.id?.toString() ?? ""))}>
                                {t('dashboard.orders.view_details')}
                            </DropdownMenuItem>

                            {isClient && !isCancelled && isPending && (
                                <DropdownMenuItem
                                    className="text-orange-600"
                                    onClick={() => onAnnuleCommande?.(order.id || 0)}
                                >
                                    {t('dashboard.orders.cancel_order')}
                                </DropdownMenuItem>
                            )}

                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];
};
