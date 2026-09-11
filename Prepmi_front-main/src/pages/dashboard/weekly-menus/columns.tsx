import { WeeklyMenu } from "@/interfaces/admin"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Calendar, MoreHorizontal, Pencil, Trash, Eye } from "lucide-react"
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
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export const columns: ColumnDef<WeeklyMenu>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Titre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const menu = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium">{menu.title}</span>
          {menu.description && (
            <span className="text-xs text-muted-foreground line-clamp-1">
              {menu.description}
            </span>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: "week_start_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Période
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const menu = row.original
      try {
        const startDate = new Date(menu.week_start_date)
        const endDate = new Date(menu.week_end_date)

        return (
          <div className="flex flex-col text-sm">
            <span className="font-medium">
              {format(startDate, "dd MMM", { locale: fr })} - {format(endDate, "dd MMM yyyy", { locale: fr })}
            </span>
            <span className="text-xs text-muted-foreground">
              Semaine {format(startDate, "w", { locale: fr })}
            </span>
          </div>
        )
      } catch (error) {
        return <span className="text-muted-foreground">-</span>
      }
    }
  },
  {
    id: "meals_count",
    header: "Repas",
    cell: ({ row }) => {
      const menu = row.original
      const mealsCount = menu.meals?.length || 0
      const featuredCount = menu.meals?.filter(m => m.is_featured)?.length || 0

      return (
        <div className="flex gap-1 flex-wrap">
          <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
            {mealsCount} repas
          </Badge>
          {featuredCount > 0 && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
              {featuredCount} vedette
            </Badge>
          )}
        </div>
      )
    }
  },
  {
    id: "status",
    header: "Statut",
    cell: ({ row }) => {
      const menu = row.original
      const badges = []

      if (menu.is_published) {
        badges.push(
          <Badge key="published" className="bg-green-500 hover:bg-green-600 text-white">
            Publié
          </Badge>
        )
      } else {
        badges.push(
          <Badge key="draft" variant="outline" className="text-gray-600 border-gray-300 bg-gray-50">
            Brouillon
          </Badge>
        )
      }

      if (menu.is_active) {
        badges.push(
          <Badge key="active" className="bg-blue-500 hover:bg-blue-600 text-white">
            Actif
          </Badge>
        )
      }

      return <div className="flex gap-1 flex-wrap">{badges}</div>
    }
  },
  {
    id: "availability",
    header: "Disponibilité",
    cell: ({ row }) => {
      const menu = row.original

      try {
        const now = new Date()
        const startDate = new Date(menu.week_start_date)
        const endDate = new Date(menu.week_end_date)

        let className = ""
        let status = "À venir"

        if (now >= startDate && now <= endDate) {
          className = "bg-emerald-500 hover:bg-emerald-600 text-white"
          status = "En cours"
        } else if (now > endDate) {
          className = "bg-red-500 hover:bg-red-600 text-white"
          status = "Terminé"
        } else {
          className = "bg-orange-500 hover:bg-orange-600 text-white"
        }

        return (
          <Badge className={className}>
            {status}
          </Badge>
        )
      } catch (error) {
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-300">
            Non défini
          </Badge>
        )
      }
    }
  },
  {
    accessorKey: "published_at",
    header: "Publication",
    cell: ({ row }) => {
      const menu = row.original

      if (!menu.published_at) {
        return <span className="text-muted-foreground text-sm">-</span>
      }

      try {
        const publishedDate = new Date(menu.published_at)
        return (
          <span className="text-sm">
            {format(publishedDate, "dd/MM/yyyy", { locale: fr })}
          </span>
        )
      } catch (error) {
        return <span className="text-muted-foreground text-sm">-</span>
      }
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const menu = row.original
      const navigate = useNavigate()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(menu.id?.toString() || "")}
            >
              Copier ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate(webRoutes.dashboard_weekly_menus_view.replace(':id', menu.id?.toString() || ''))}
            >
              <Eye className="mr-2 h-4 w-4" />
              Voir détails
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(webRoutes.dashboard_weekly_menus_edit.replace(':id', menu.id?.toString() || ''))}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                // This will be handled by the parent component
                const event = new CustomEvent('deleteWeeklyMenu', { detail: menu.id })
                window.dispatchEvent(event)
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
