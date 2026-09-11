import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    VisibilityState
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import EmptyStateComponent from "@/components/dashboard/custom/emptyState"
import { IconChefHat } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import TableLoading from "@/components/skeleton/TableLoading"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    loading?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    loading
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([
        { id: "preparation_date", desc: false }
    ])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [mealSearch, setMealSearch] = useState<string>("")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        },
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },
    })

    // Apply status filter
    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        if (value === "all") {
            table.getColumn("order_status")?.setFilterValue(undefined);
        } else {
            table.getColumn("order_status")?.setFilterValue(value);
        }
    };

    // Apply meal search filter
    const handleMealSearch = (value: string) => {
        setMealSearch(value);
        table.getColumn("meals")?.setFilterValue(value);
    };

    // Custom filter function for meal names
    useMemo(() => {
        const mealsColumn = table.getColumn("meals");
        if (mealsColumn) {
            mealsColumn.columnDef.filterFn = (row, columnId, filterValue) => {
                if (!filterValue) return true;
                const meals = row.getValue(columnId) as any[];
                return meals?.some((meal: any) =>
                    meal.name?.toLowerCase().includes(filterValue.toLowerCase())
                ) ?? false;
            };
        }
    }, [table]);

    return (
        <div className="rounded-md border bg-card">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4">
                <Input
                    placeholder="Rechercher un repas..."
                    value={mealSearch}
                    onChange={(event) =>
                        handleMealSearch(event.target.value)
                    }
                    className="max-w-sm"
                />

                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="Pending">En attente</SelectItem>
                         <SelectItem value="Preparing">En préparation</SelectItem>
                        <SelectItem value="Shipped">Expédié</SelectItem>
                        <SelectItem value="Delivered">Livré</SelectItem>
                        <SelectItem value="Cancelled">Annulé</SelectItem>
                     </SelectContent>
                </Select>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Colonnes
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading === false ? (
                            <>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            <EmptyStateComponent
                                                title="Aucune préparation trouvée"
                                                description="Il n'y a pas de repas à préparer pour le moment"
                                                icon={<IconChefHat size={48} />}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        ) : (
                            <TableLoading />
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} repas à préparer
                </div>
                <div className="flex items-center justify-end space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Précédente
                    </Button>
                    <div className="text-sm">
                        Page {table.getState().pagination.pageIndex + 1} sur{" "}
                        {table.getPageCount()}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Suivante
                    </Button>
                </div>
            </div>
        </div>
    )
}
