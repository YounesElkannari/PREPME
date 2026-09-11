import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import http from "@/utils/http"
import { apiRoutes } from "@/routes/api"
import { handleErrorResponse } from "@/utils"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Check } from "lucide-react"
import { webRoutes } from "@/routes/web"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { RoleEnum } from "@/enum/RoleEnum"

const statusVariant: Record<string, string> = {
    active: "bg-green-500",
    pending: "bg-yellow-500",
    frozen: "bg-blue-500",
    cancelled: "bg-red-500",
}

const transactionStatusVariant: Record<string, string> = {
    completed: "bg-green-500",
    pending: "bg-yellow-500",
    failed: "bg-red-500",
    refunded: "bg-purple-500",
}

export default function MembershipDetails() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [membership, setMembership] = useState<any | null>(null)
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const admin = useSelector((state: RootState) => state.admin?.user)
    const isAdmin = Number(admin?.role) === RoleEnum.ADMIN

    const fetchMembershipDetails = () => {
        if (id) {
            Promise.all([
                http.get(`${apiRoutes.memberships}/${id}`),
                http.get(`${apiRoutes.membershipTransactions}?membership_id=${id}`)
            ])
                .then(([membershipRes, transactionsRes]) => {
                    const membershipData = membershipRes.data.data ?? membershipRes.data
                    const transactionsData = transactionsRes.data.data ?? transactionsRes.data
                    
                    setMembership(membershipData)
                    setTransactions(Array.isArray(transactionsData) ? transactionsData : [])
                })
                .catch(handleErrorResponse)
                .finally(() => setLoading(false))
        }
    }

    useEffect(() => {
        fetchMembershipDetails()
    }, [id])

    const handleActivate = async () => {
        try {
            await http.post(`${apiRoutes.memberships}/${id}/activate`)
            toast.success("Membership activated successfully")
            fetchMembershipDetails()
        } catch (error) {
            toast.error("Error activating membership")
        }
    }

    const handleFreeze = async () => {
        try {
            await http.post(`${apiRoutes.memberships}/${id}/freeze`)
            toast.success("Membership frozen successfully")
            fetchMembershipDetails()
        } catch (error) {
            toast.error("Error freezing membership")
        }
    }

    const handleUnfreeze = async () => {
        try {
            await http.post(`${apiRoutes.memberships}/${id}/unfreeze`)
            toast.success("Membership reactivated successfully")
            fetchMembershipDetails()
        } catch (error) {
            toast.error("Error reactivating membership")
        }
    }

    const handleCancel = async () => {
        if (window.confirm("Are you sure you want to cancel this membership?")) {
            try {
                await http.post(`${apiRoutes.memberships}/${id}/cancel`)
                toast.success("Membership cancelled successfully")
                fetchMembershipDetails()
            } catch (error) {
                toast.error("Error cancelling membership")
            }
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-96">Loading membership details...</div>
    }

    if (!membership) {
        return <div>Membership not found.</div>
    }

    const plan = membership.membership_plan || {}
    const user = membership.user || {}
    const status = membership.status

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(webRoutes.dashboard_memberships)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold">Membership Details #{membership.id}</h1>
                </div>
                <div className="flex gap-2">
                    {status === "pending" && isAdmin && (
                        <Button onClick={handleActivate} variant="default">
                            Activate
                        </Button>
                    )}
                    {status === "active" && (
                        <Button onClick={handleFreeze} variant="secondary">
                            Freeze
                        </Button>
                    )}
                    {status === "frozen" && (
                        <Button onClick={handleUnfreeze} variant="default">
                            Reactivate
                        </Button>
                    )}
                    {(status === "active" || status === "frozen") && (
                        <Button onClick={handleCancel} variant="destructive">
                            Cancel Membership
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Member Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Member Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="font-semibold text-sm text-gray-600">Name</p>
                            <p className="text-lg">{user.name || "-"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-gray-600">Email</p>
                            <p className="text-lg">{user.email || "-"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-gray-600">Phone</p>
                            <p className="text-lg">{user.phone || "-"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-gray-600">Status</p>
                            <Badge className={`capitalize ${statusVariant[status] || "bg-gray-500"}`}>
                                {status === "active" ? "Active" :
                                 status === "pending" ? "Pending" :
                                 status === "frozen" ? "Frozen" :
                                 status === "cancelled" ? "Cancelled" : status}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Membership Plan */}
                <Card>
                    <CardHeader>
                        <CardTitle>Membership Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="font-semibold text-lg">{plan.name}</p>
                            <p className="text-sm text-gray-600">{plan.description}</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Monthly Fee</span>
                            <span className="font-bold">{plan.monthly_fee} MAD</span>
                        </div>
                        {parseFloat(plan.discount_percentage || 0) > 0 && (
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Discount</span>
                                <span className="font-semibold text-green-600">{plan.discount_percentage}%</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Delivery Slots</span>
                            <span className="font-semibold">{plan.delivery_slots} per week</span>
                        </div>
                        {plan.includes_free_desserts && (
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Free Desserts</span>
                                <span className="font-semibold">{plan.free_desserts_quantity} per week</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Membership Details */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Membership Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-4">
                        <div>
                            <p className="font-semibold text-sm text-gray-600">Start Date</p>
                            <p className="text-lg">
                                {membership.started_at ? new Date(membership.started_at).toLocaleDateString("en-US") : "-"}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-gray-600">Next Billing</p>
                            <p className="text-lg">
                                {membership.next_billing_date ? new Date(membership.next_billing_date).toLocaleDateString("en-US") : "-"}
                            </p>
                        </div>
                        {membership.cancelled_at && (
                            <div>
                                <p className="font-semibold text-sm text-gray-600">Cancellation Date</p>
                                <p className="text-lg">
                                    {new Date(membership.cancelled_at).toLocaleDateString("en-US")}
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-sm text-gray-600">Auto Renewal</p>
                            <p className="text-lg">
                                {status === "cancelled" ? "No" : "Yes"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Perks */}
                {plan.perks && plan.perks.length > 0 && (
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Included Benefits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid md:grid-cols-2 gap-2">
                                {plan.perks.map((perk: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>{perk}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Transactions History */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {transactions.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Reference</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((transaction: any) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>
                                                {new Date(transaction.created_at).toLocaleDateString("en-US")}
                                            </TableCell>
                                            <TableCell className="capitalize">
                                                {transaction.transaction_type?.replace("_", " ")}
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {transaction.amount} MAD
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`capitalize ${transactionStatusVariant[transaction.payment_status] || "bg-gray-500"}`}>
                                                    {transaction.payment_status === "completed" ? "Completed" :
                                                     transaction.payment_status === "pending" ? "Pending" :
                                                     transaction.payment_status === "failed" ? "Failed" :
                                                     transaction.payment_status === "refunded" ? "Refunded" :
                                                     transaction.payment_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="capitalize">
                                                {transaction.payment_method || "-"}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {transaction.payment_reference || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No transactions found</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
