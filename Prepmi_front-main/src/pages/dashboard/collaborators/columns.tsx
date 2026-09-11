import { Collaborator } from "@/interfaces/admin"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<Collaborator>[] = [
    {
        accessorKey: "full_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Full Name
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
        header: "Phone",
    },
    {
        accessorKey: "country",
        header: "Country",
    },
    {
        accessorKey: "social_url_1",
        header: "Social URL 1",
        cell: ({ row }) => {
            const url = row.getValue("social_url_1") as string
            return url ? (
                <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => window.open(url, '_blank')}
                >
                    {url} <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
            ) : "-"
        }
    },
    {
        accessorKey: "social_url_2",
        header: "Social URL 2",
        cell: ({ row }) => {
            const url = row.getValue("social_url_2") as string
            return url ? (
                <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => window.open(url, '_blank')}
                >
                    {url} <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
            ) : "-"
        }
    },
    {
        accessorKey: "social_url_3",
        header: "Products Interested",
        cell: ({ row }) => {
            const url = row.getValue("social_url_3") as string
            return url 
        }
    },
]