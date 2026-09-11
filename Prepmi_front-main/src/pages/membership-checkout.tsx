import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, CreditCard, Shield, ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useQuery, useMutation } from "@tanstack/react-query"
import http from "@/utils/http"
import { apiRoutes } from "@/routes/api"
import { handleErrorResponse } from "@/utils"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { toast } from "sonner"

interface MembershipPlan {
    id: number
    name: string
    description: string
    monthly_fee: string
    discount_percentage: string
    delivery_slots: number
    includes_free_desserts: boolean
    free_desserts_quantity: number
    perks: string[]
    is_active: boolean
    billing_day_of_month: number
}

export default function MembershipCheckout() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { planId } = useParams()
    const admin = useSelector((state: RootState) => state.admin?.user)

    const [isProcessing, setIsProcessing] = useState(false)
    const selectedPlanId = planId ? parseInt(planId) : location.state?.membershipPlanId

    // Redirect if not authenticated
    useEffect(() => {
        if (!admin?.id) {
            navigate('/login', { state: { from: location.pathname, selectedPlanId } })
        }
    }, [admin, navigate, location.pathname, selectedPlanId])

    // Redirect if no plan selected
    useEffect(() => {
        if (!selectedPlanId) {
            toast.error(t('membershipCheckout.noPlanSelected', 'Please select a membership plan'))
            navigate('/membership-plans')
        }
    }, [selectedPlanId, navigate, t])

    // Fetch the selected plan details
    const { isLoading, data: planResponse, error } = useQuery<MembershipPlan | null>({
        queryKey: ["membership-plan", selectedPlanId],
        queryFn: () =>
            http
                .get(`${apiRoutes.membershipPlans}`)
                .then((res) => {
                    // Handle both res.data.data and res.data response formats
                    const plan = res && res.data ? (res.data.data ?? res.data) : null
                    if (!plan) {
                        throw new Error('Plan not found')
                    }
                    return plan
                })
                .catch((e) => {
                    handleErrorResponse(e)
                    throw e
                }),
        enabled: !!selectedPlanId && !!admin?.id,
    })

    const plan = planResponse

    // Create membership subscription mutation
    const createMembership = useMutation({
        mutationFn: (data: { membership_plan_id: number; payment_method?: string }) =>
            http.post(apiRoutes.memberships, data),
        onSuccess: () => {
            toast.success(t('membershipCheckout.success', 'Membership activated successfully!'))
            // Redirect to dashboard or thank you page
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000)
        },
        onError: (error: any) => {
            handleErrorResponse(error)
            setIsProcessing(false)
        },
    })

    const handleConfirmSubscription = () => {
        if (!selectedPlanId || !admin?.id) return

        setIsProcessing(true)

        createMembership.mutate({
            membership_plan_id: selectedPlanId,
            payment_method: 'card', // You can add payment method selection
        })
    }

    if (!admin?.id) {
        return null // Will redirect via useEffect
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">{t('common.loading', 'Loading...')}</p>
                </div>
            </div>
        )
    }

    if (error || !plan) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 pt-20 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('membershipCheckout.planNotFound', 'Plan not found')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t('membershipCheckout.planNotFoundDescription', 'The selected membership plan could not be found.')}
                    </p>
                    <Button onClick={() => navigate('/membership-plans')}>
                        {t('membershipCheckout.backToPlans', 'Back to Plans')}
                    </Button>
                </div>
            </div>
        )
    }

    const monthlyFee = parseFloat(plan.monthly_fee)
    const discount = parseFloat(plan.discount_percentage)
    const total = monthlyFee

    return (
        <main className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 pt-20">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="max-w-5xl mx-auto mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/membership-plans')}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('membershipCheckout.backToPlans', 'Back to Plans')}
                    </Button>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {t('membershipCheckout.title', 'Complete Your')}
                        <span className="text-primary"> {t('membershipCheckout.titleHighlight', 'Membership')}</span>
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        {t('membershipCheckout.subtitle', 'Review your membership details and confirm your subscription')}
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
                    {/* Left Column - Plan Details & User Info */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Selected Plan Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                        <CardDescription className="mt-2">{plan.description}</CardDescription>
                                    </div>
                                    <Badge variant="secondary" className="  text-white text-center">
                                        {monthlyFee.toFixed(2)} MAD/month
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Key Features */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">
                                        {t('membershipCheckout.included', "What's Included")}
                                    </h3>
                                    <div className="space-y-2">
                                        {discount > 0 && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <span>{discount}% {t('membershipPlans.discountOnOrders', 'discount on all orders')}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm">
                                            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <span>{plan.delivery_slots} {t('membershipPlans.deliverySlots', 'delivery slots per week')}</span>
                                        </div>
                                        {plan.includes_free_desserts && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <span>{plan.free_desserts_quantity} {t('membershipPlans.freeDesserts', 'free desserts per week')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Perks */}
                                {plan.perks && plan.perks.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">
                                            {t('membershipPlans.perks', 'Additional Perks')}
                                        </h3>
                                        <ul className="space-y-2">
                                            {plan.perks.map((perk, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                                    <span>{perk}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('membershipCheckout.accountInfo', 'Account Information')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{t('membershipCheckout.name', 'Name')}:</span>
                                    <span className="font-medium">{admin.first_name || admin.last_name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{t('membershipCheckout.email', 'Email')}:</span>
                                    <span className="font-medium">{admin.email}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Billing Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    {t('membershipCheckout.billingInfo', 'Billing Information')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-900">
                                        {t('membershipCheckout.billingNote', 'Your membership will be billed monthly on day')} {plan.billing_day_of_month} {t('membershipCheckout.ofEachMonth', 'of each month')}.
                                    </p>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>{t('membershipCheckout.paymentNote', 'Payment will be processed securely. You can cancel your membership at any time.')}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="md:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>{t('membershipCheckout.orderSummary', 'Order Summary')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{t('membershipCheckout.membershipPlan', 'Membership Plan')}:</span>
                                        <span className="font-medium">{plan.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{t('membershipCheckout.monthlyFee', 'Monthly Fee')}:</span>
                                        <span className="font-medium">{monthlyFee.toFixed(2)} MAD</span>
                                    </div>

                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>{t('membershipCheckout.total', 'Total')}:</span>
                                    <span className="text-primary">{total.toFixed(2)} MAD</span>
                                </div>

                                <div className="text-xs text-gray-500">
                                    {t('membershipCheckout.recurringCharge', 'This is a recurring monthly charge')}
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handleConfirmSubscription}
                                    disabled={isProcessing}
                                >
                                    {isProcessing
                                        ? t('membershipCheckout.processing', 'Processing...')
                                        : t('membershipCheckout.confirmSubscription', 'Confirm Subscription')}
                                </Button>

                                <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
                                    <Shield className="w-4 h-4" />
                                    <span>{t('membershipCheckout.securePayment', 'Secure payment processing')}</span>
                                </div>

                                <p className="text-xs text-center text-gray-500">
                                    {t('membershipCheckout.terms', 'By confirming, you agree to our Terms of Service and Privacy Policy. You can cancel anytime.')}
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    )
}
