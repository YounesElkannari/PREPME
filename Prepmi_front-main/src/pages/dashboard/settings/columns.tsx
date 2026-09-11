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

interface Setting {
  id: number;
  key: string;
  value: string;
  type: 'string' | 'integer' | 'boolean' | 'json' | 'image';
  description: string;
}

export const columns: ColumnDef<Setting>[] = [
  {
    accessorKey: "key",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Key
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const key = row.getValue("key") as string
      return (
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
          {key}
        </code>
      )
    }
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const value = row.getValue("value") as string
      const type = row.original.type
      
      if (type === 'boolean') {
        return (
          <Badge variant={value === 'true' ? "default" : "secondary"}>
            {value === 'true' ? 'True' : 'False'}
          </Badge>
        )
      }
      
      if (type === 'image') {
        if (!value) {
          return <span className="text-muted-foreground text-sm">No image</span>
        }
        return (
          <div className="flex items-center gap-2">
            <img 
              src={value} 
              alt="Setting image" 
              className="w-16 h-16 object-cover rounded border"
            />
          </div>
        )
      }
      
      if (type === 'json') {
        return (
          <div className="max-w-[200px] truncate font-mono text-xs" title={value}>
            {value}
          </div>
        )
      }
      
      return (
        <div className="max-w-[300px] truncate" title={value}>
          {value || "-"}
        </div>
      )
    }
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      const typeColors: Record<string, string> = {
        string: "bg-blue-500",
        integer: "bg-green-500",
        boolean: "bg-purple-500",
        json: "bg-orange-500",
        image: "bg-pink-500",
      }
      
      return (
        <Badge className={typeColors[type] || "bg-gray-500"}>
          {type}
        </Badge>
      )
    }
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="max-w-[300px] truncate text-sm text-muted-foreground" title={description}>
          {description || "-"}
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const setting = row.original

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
              onClick={() => {
                const event = new CustomEvent('editSetting', { detail: setting });
                window.dispatchEvent(event);
              }}
            >
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
