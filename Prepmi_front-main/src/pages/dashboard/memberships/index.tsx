import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react"
import http from "@/utils/http"
import { apiRoutes } from "@/routes/api"
import { toast } from "sonner"
import { handleErrorResponse } from "@/utils"

interface Membership {
    id: number
    user_id: number
    membership_plan_id: number
    status: string
    started_at: string
    next_billing_date: string
    cancelled_at?: string
    user?: any
    membership_plan?: any
}



export default function MembershipIndex() {
    const [data, setData] = useState<Membership[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const fetchMemberships = () => {
        setLoading(true)

        http.get(apiRoutes.memberships).then((response) => {
            const memberships = response.data.data ?? response.data

            setData(Array.isArray(memberships) ? memberships : [])
        })
            .catch((error) => {
                console.error("Error fetching memberships:", error)
                toast.error("Error loading memberships")
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchMemberships()
    }, [])

    const handleActivate = async (membershipId: number) => {
        try {
            await http.post(`${apiRoutes.memberships}/${membershipId}/activate`)
            toast.success("Membership activated successfully")
            fetchMemberships()
        } catch (error) {
            handleErrorResponse(error)
        }
    }

    const handleFreeze = async (membershipId: number) => {
        try {
            await http.post(`${apiRoutes.memberships}/${membershipId}/freeze`)
            toast.success("Membership frozen successfully")
            fetchMemberships()
        } catch (error) {
            handleErrorResponse(error)
        }
    }

    const handleUnfreeze = async (membershipId: number) => {
        try {
            await http.post(`${apiRoutes.memberships}/${membershipId}/unfreeze`)
            toast.success("Membership reactivated successfully")
            fetchMemberships()
        } catch (error) {
            handleErrorResponse(error)
        }
    }

    const handleCancel = async (membershipId: number) => {
        try {
            await http.post(`${apiRoutes.memberships}/${membershipId}/cancel`)
            toast.success("Membership cancelled successfully")
            fetchMemberships()
        } catch (error) {
            handleErrorResponse(error)
        }
    }

    return (
        <>
            <div className="flex justify-between items-center w-full mb-4">
                <h1 className="text-3xl font-bold m-2">Memberships</h1>
            </div>

            {/* Statistics Cards */}
            {/* {stats && (
                <div className="grid gap-4 md:grid-cols-5 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Frozen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.frozen}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                        </CardContent>
                    </Card>
                </div>
            )} */}

            <DataTable
                columns={columns({
                    onActivate: handleActivate,
                    onFreeze: handleFreeze,
                    onUnfreeze: handleUnfreeze,
                    onCancel: handleCancel,
                })}
                data={data}
                loading={loading}
            />
        </>
    )
}
