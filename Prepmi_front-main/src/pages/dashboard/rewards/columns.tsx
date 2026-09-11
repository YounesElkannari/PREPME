// Reward interface for columns
export interface Reward {
  type: string;
  value: number;
  title: string;
  description: string;
  is_used: boolean;
  earned_at: string;
  expires_at: string;
  used_at?: string;
  used_order_id?: string;
  discount_applied?: boolean;
  conditions?: string;
}
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Reward>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "value",
    header: "Valeur",
    cell: ({ row }) => {
      const value = row.getValue("value") as number;
      return <span>{value}</span>;
    }
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Titre
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[300px] truncate" title={description}>
          {description || "-"}
        </div>
      );
    }
  },
  {
    accessorKey: "is_used",
    header: "Utilisé",
    cell: ({ row }) => {
      const isUsed = row.getValue("is_used") as boolean;
      return (
        <Badge className={isUsed ? "bg-green-500" : "bg-yellow-500"}>
          {isUsed ? "Oui" : "Non"}
        </Badge>
      );
    }
  },
  {
    accessorKey: "earned_at",
    header: "Obtenu le",
    cell: ({ row }) => {
      const earnedAt = row.getValue("earned_at") as string;
      return <span>{earnedAt ? new Date(earnedAt).toLocaleString() : "-"}</span>;
    }
  },
  {
    accessorKey: "expires_at",
    header: "Expire le",
    cell: ({ row }) => {
      const expiresAt = row.getValue("expires_at") as string;
      return <span>{expiresAt ? new Date(expiresAt).toLocaleString() : "-"}</span>;
    }
  },
  {
    accessorKey: "used_at",
    header: "Utilisé le",
    cell: ({ row }) => {
      const usedAt = row.getValue("used_at") as string;
      return <span>{usedAt ? new Date(usedAt).toLocaleString() : "-"}</span>;
    }
  },
  {
    accessorKey: "used_order_id",
    header: "Commande utilisée",
    cell: ({ row }) => {
      const orderId = row.getValue("used_order_id") as string;
      return <span>{orderId || "-"}</span>;
    }
  },
  {
    accessorKey: "discount_applied",
    header: "Remise appliquée",
    cell: ({ row }) => {
      const discount = row.getValue("discount_applied") as boolean;
      return (
        <Badge className={discount ? "bg-green-500" : "bg-gray-500"}>
          {discount ? "Oui" : "Non"}
        </Badge>
      );
    }
  },
  {
    accessorKey: "conditions",
    header: "Conditions",
    cell: ({ row }) => {
      const conditions = row.getValue("conditions") as string;
      return <span>{conditions || "-"}</span>;
    }
  },

]
