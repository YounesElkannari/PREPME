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
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import http from "@/utils/http"
import { apiRoutes } from "@/routes/api"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"

interface Setting {
  id: number;
  key: string;
  value: string;
  type: 'string' | 'integer' | 'boolean' | 'json' | 'image';
  description: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  onRefresh?: () => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  onRefresh,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentSetting, setCurrentSetting] = useState<Setting | null>(null)
  const [formValue, setFormValue] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  useEffect(() => {
    const handleEditSetting = (event: any) => {
      const setting = event.detail as Setting
      setCurrentSetting(setting)
      setFormValue(setting.value)
      setImagePreview(setting.type === 'image' && setting.value ? setting.value : null)
      setEditDialogOpen(true)
    }

    window.addEventListener('editSetting', handleEditSetting)
    return () => window.removeEventListener('editSetting', handleEditSetting)
  }, [])

  const handleSave = async () => {
    if (!currentSetting) return

    setSaving(true)
    try {
      await http.put(`${apiRoutes.settings}/${currentSetting.id}`, {
        value: formValue,
      })
      toast.success("Setting updated successfully!")
      setEditDialogOpen(false)
      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error("Error updating setting:", error)
      toast.error("Failed to update setting")
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await http.post(apiRoutes.mediaUpload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const imageUrl = response.data.full_url || response.data.url
      setFormValue(imageUrl)
      setImagePreview(imageUrl)
      toast.success("Image uploaded successfully!")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const renderValueInput = () => {
    if (!currentSetting) return null

    switch (currentSetting.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id="value"
              checked={formValue === 'true'}
              onCheckedChange={(checked) => setFormValue(checked ? 'true' : 'false')}
            />
            <Label htmlFor="value">
              {formValue === 'true' ? 'Enabled' : 'Disabled'}
            </Label>
          </div>
        )

      case 'integer':
        return (
          <Input
            id="value"
            type="number"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Enter integer value"
          />
        )

      case 'image':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="flex-1"
              />
              {uploading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              )}
            </div>
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-48 object-contain rounded border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setFormValue('')
                    setImagePreview(null)
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Upload an image (max 5MB, jpg/png/gif)
            </p>
          </div>
        )

      case 'json':
        return (
          <Textarea
            id="value"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Enter JSON value"
            className="font-mono text-sm"
            rows={6}
          />
        )

      case 'string':
      default:
        return (
          <Input
            id="value"
            type="text"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Enter value"
          />
        )
    }
  }

  return (
    <div>
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter by key..."
          value={(table.getColumn("key")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("key")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {onRefresh && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
      <div className="rounded-md border">
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
            <DialogDescription>
              {currentSetting?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                value={currentSetting?.key || ""}
                disabled
                className="bg-muted font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={currentSetting?.type || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              {renderValueInput()}
              {currentSetting?.type === 'json' && (
                <p className="text-xs text-muted-foreground">
                  Make sure to enter valid JSON format
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
