import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, ImageIcon } from "lucide-react"
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
import { MealTypesEnum } from "@/enum/MealTypesEnum"
import { Meal } from "@/interfaces/admin"

const getTypeName = (typeId?: number): string => {
  switch (typeId) {
    case MealTypesEnum.Menu:
      return "Menu"
    case MealTypesEnum.Breakfast:
      return "Breakfast"
    case MealTypesEnum.Drink:
      return "Drink"
    case MealTypesEnum.Dessert:
      return "Dessert"
    default:
      return "-"
  }
}

export const columns: ColumnDef<Meal>[] = [
  {
    accessorKey: "image_path",
    header: "Image",
    cell: ({ row }) => {
      const meal = row.original
      return meal.image_url ? (
        <img
          src={meal.image_url}
          alt={meal.name}
          className="w-10 h-10 rounded-md object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-gray-400" />
        </div>
      )
    },
  },
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
    id: "category",
    accessorFn: (row) => row.category?.name || "",
    header: "Catégorie",
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true
      const categoryName = row.original.category?.name || ""
      return categoryName === filterValue
    },
    cell: ({ row }) => {
      const meal = row.original
      return meal.category?.name ? (
        <Badge variant="outline">{meal.category.name}</Badge>
      ) : (
        <span className="text-gray-400">-</span>
      )
    },
  },
  {
    id: "type",
    accessorFn: (row) => getTypeName(row.type_id),
    header: "Type",
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true
      return getTypeName(row.original.type_id) === filterValue
    },
    cell: ({ row }) => {
      const typeName = getTypeName(row.original.type_id)
      return typeName !== "-" ? (
        <Badge variant="secondary" className="text-white">
          {typeName}
        </Badge>
      ) : (
        <span className="text-gray-400">-</span>
      )
    },
  },
  {
    accessorKey: "short_description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("short_description") as string
      return (
        <div className="max-w-[200px] truncate" title={description}>
          {description}
        </div>
      )
    },
  },
  {
    accessorKey: "price",
    header: "Prix",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") as string)
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "MAD",
      }).format(price)
    },
  },
  {
    id: "nutrition.calories",
    accessorKey: "nutrition.calories",
    header: "Calories",
    cell: ({ row }) => row.original.nutrition?.calories || "-",
  },
  {
    id: "preparation.prep_time_minutes",
    accessorKey: "preparation.prep_time_minutes",
    header: "Temps préparation",
    cell: ({ row }) => {
      const time = row.original.preparation?.prep_time_minutes
      return time ? `${time} min` : "-"
    },
  },
  {
    id: "dietary_info",
    header: "Régime",
    cell: ({ row }) => {
      const meal = row.original
      const badges: string[] = []
      if (meal.dietary_info?.is_vegetarian) badges.push("Végétarien")
      if (meal.dietary_info?.is_vegan) badges.push("Vegan")
      if (meal.dietary_info?.is_gluten_free) badges.push("Sans gluten")
      if (meal.dietary_info?.is_keto) badges.push("Keto")

      return (
        <div className="flex gap-1 flex-wrap">
          {badges.slice(0, 2).map((badge, index) => (
            <Badge key={index} variant="secondary" className="text-xs text-white">
              {badge}
            </Badge>
          ))}
          {badges.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{badges.length - 2}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "availability",
    header: "Disponibilité",
    cell: ({ row }) => {
      const meal = row.original
      if (!meal.available_from || !meal.available_to) {
        return <Badge variant="outline">Non défini</Badge>
      }
      const now = new Date()
      const availableFrom = new Date(meal.available_from)
      const availableTo = new Date(meal.available_to)
      const isAvailable =
        now >= availableFrom && now <= availableTo && meal.is_active

      return (
        <Badge className={isAvailable ? "bg-green-500" : "bg-red-500"}>
          {isAvailable ? "Disponible" : "Indisponible"}
        </Badge>
      )
    },
  },
  {
    id: "status",
    header: "Statut",
    cell: ({ row }) => (
      <Badge className="capitalize">
        {row.original.is_active ? "Actif" : "Inactif"}
      </Badge>
    ),
  },
  {
    id: "membership",
    header: "Membres",
    cell: ({ row }) =>
      row.original.is_membership ? (
        <Badge className="bg-blue-600 text-white">l'adhésion</Badge>
      ) : (
        <Badge variant="outline">Public</Badge>
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const meal = row.original
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
            <DropdownMenuItem
              onClick={() =>
                navigate(
                  webRoutes.meal_single.replace(
                    ":id",
                    meal.id?.toString() || ""
                  )
                )
              }
            >
              Voir les détails
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/dashboard/meals/edit/${meal.id}`)}
            >
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]