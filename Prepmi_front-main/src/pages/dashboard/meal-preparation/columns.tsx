import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusConfig = {
  Pending: {
    label: "En attente",
    variant: "bg-yellow-500 hover:bg-yellow-600",
  },

  Preparing: {
    label: "En préparation",
    variant: "bg-cyan-500 hover:bg-cyan-600",
  },
  Shipped: {
    label: "Expédié",
    variant: "bg-indigo-500 hover:bg-indigo-600",
  },
  Delivered: {
    label: "Livré",
    variant: "bg-green-500 hover:bg-green-600",
  },
  Cancelled: {
    label: "Annulé",
    variant: "bg-red-500 hover:bg-red-600",
  },
};

export const columns = (
  onStatusUpdate?: (orderId: string, status: string) => Promise<void>
): ColumnDef<any>[] => [
    {
      accessorKey: "order_num",
      header: "N° Commande",
      cell: ({ row }) => row.original.order_num,
    },
    {
      accessorKey: "meals",
      header: "Repas & Quantité",
      cell: ({ row }) => {
        const meals = row.original.meals || [];
        console.log('ha hwa:', row.original);
        return (
          <div>
            {meals.map((meal: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="font-medium">{meal.name} ({meal.size})</span>
                <span className="text-xs text-muted-foreground">
                  x{meal.quantity}
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "deliveries",
      header: "Jours de livraison",
      cell: ({ row }) => {
        const deliveries = row.original.deliveries || [];
        const daysMap: Record<number, string> = {
          0: 'Dim',
          1: 'Lun',
          2: 'Mar',
          3: 'Mer',
          4: 'Jeu',
          5: 'Ven',
          6: 'Sam'
        };

        if (deliveries.length === 0) return <span className="text-muted-foreground">-</span>;

        return (
          <div className="flex flex-wrap gap-1">
            {deliveries.map((delivery: any, idx: number) => {
              const deliveryDate = delivery.delivery_window_start
                ? new Date(delivery.delivery_window_start)
                : null;
              const dayOfWeek = deliveryDate ? daysMap[deliveryDate.getDay()] : '-';

              return (
                <Badge key={idx} variant="outline" className="text-xs">
                  {dayOfWeek}
                </Badge>
              );
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "order_status",
      header: "Statut commande",
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const status = row.getValue(columnId);
        return status === filterValue;
      },
      cell: ({ row }) => {
        const status = row.original.order_status;
        const config =
          statusConfig[status as keyof typeof statusConfig] ||
          statusConfig.Pending;
        return (
          <div className="flex items-center gap-2">
            <Badge className={`capitalize ${config.variant}`}>
              {config.label}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Actions",
      cell: ({ row }) => {
        const status = row.original.order_status;
        const config =
          statusConfig[status as keyof typeof statusConfig] ||
          statusConfig.Pending;

        // Filter out Cancelled option if current status is not Pending
        const availableStatuses = status === "Pending" 
          ? Object.entries(statusConfig)
          : Object.entries(statusConfig).filter(([key]) => key !== "Cancelled");

        return (
          <div className="flex items-center gap-2">
            {onStatusUpdate && (
              <Select
                value={status}
                onValueChange={async (newStatus) => {
                  await onStatusUpdate(row.original.order_id, newStatus);
                }}
              >
                <SelectTrigger
                  className={`w-[120px] ${config.variant} text-white border-none`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${value.variant}`}
                        ></div>
                        {value.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        );
      },
    },
  ];
