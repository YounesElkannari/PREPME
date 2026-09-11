import { Partner } from "@/interfaces/admin"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<Partner>[] = [
    {
        accessorKey: "first_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    First Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "last_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Name
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
        accessorKey: "job_title",
        header: "Job Title",
    },
    {
        accessorKey: "company_name",
        header: "Company Name",
    },
    {
        accessorKey: "company_website",
        header: "Company Website",
        cell: ({ row }) => {
            const url = row.getValue("company_website") as string
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
        accessorKey: "partnership_type",
        header: "Partnership Type",
    },
    {
        accessorKey: "team_members_per_week",
        header: "Team Members/Week",
    },
    {
        accessorKey: "products_interested",
        header: "Products Interested",
        cell: ({ row }) => {
            const products = row.getValue("products_interested") as string
            return products ? products : "-"
        }
    },
    {
        accessorKey: "heard_about_us",
        header: "Heard About Us",
    },
    {
        accessorKey: "accept_terms",
        header: "Accept Terms",
        cell: ({ row }) => {
            const accepted = row.getValue("accept_terms") as boolean
            return accepted ? "Yes" : "No"
        }
    },
    {
        accessorKey: "accept_communications",
        header: "Accept Communications",
        cell: ({ row }) => {
            const accepted = row.getValue("accept_communications") as boolean
            return accepted ? "Yes" : "No"
        }
    },
]