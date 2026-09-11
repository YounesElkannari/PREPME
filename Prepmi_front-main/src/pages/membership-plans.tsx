import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Crown, Star } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import http from "@/utils/http"
import { apiRoutes } from "@/routes/api"
import { handleErrorResponse } from "@/utils"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { MembershipPlan } from "@/interfaces/admin"
import { useToast } from "@/hooks/use-toast"


const planIcons = {
    basic: Star,
    silver: Sparkles,
    gold: Crown,
    premium: Crown,
}

const planColors = {
    basic: "bg-gray-50 border-gray-200",
    silver: "bg-slate-50 border-slate-300",
    gold: "bg-amber-50 border-amber-300",
    premium: "bg-purple-50 border-purple-300",
}

export default function MembershipPlansPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { toast } = useToast()
    const admin = useSelector((state: RootState) => state.admin?.user)
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
    const continueButtonRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to continue button when a plan is selected
    useEffect(() => {
        if (selectedPlanId && continueButtonRef.current) {
            continueButtonRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }
    }, [selectedPlanId])

    // Check if user is authenticated when trying to select a plan
    const checkAuthAndNavigate = (planId: number) => {
        if (!admin?.id) {
            toast({
                title: t('common.loginRequired', 'Login Required'),
                description: t('membershipPlans.loginMessage', 'Please login to select a membership plan'),
                variant: "default",
            })
            navigate('/login', { state: { from: '/membership-plans', selectedPlanId: planId } })
            return false
        }
        return true
    }

    // Fetch membership plans from API
    const { isLoading, data: plansResponse, error } = useQuery<MembershipPlan[]>({
        queryKey: ["membership-plans-public"],
        queryFn: () =>
            http
                .get(apiRoutes.membershipPlans)
                .then((res) => {
                    // Handle both res.data.data and res.data response formats
                    const plans = res && res.data ? (res.data.data ?? res.data) : []
                    return Array.isArray(plans) ? plans : []
                })
                .catch((e) => {
                    handleErrorResponse(e)
                    throw e
                }),
    })

    const plans = plansResponse?.filter((plan) => plan.is_active) || []

    const handleSelectPlan = (planId: number) => {
        if (!checkAuthAndNavigate(planId)) return
        setSelectedPlanId(planId)
    }

    const handleProceedToCheckout = () => {
        if (!selectedPlanId) return

        // Check authentication before proceeding
        if (!checkAuthAndNavigate(selectedPlanId)) return

        // Navigate to dedicated membership checkout page
        navigate(`/membership-checkout/${selectedPlanId}`)
    }

    const getPlanIcon = (planName: string) => {
        const name = planName.toLowerCase()
        if (name.includes('gold') || name.includes('premium')) return planIcons.gold
        if (name.includes('silver')) return planIcons.silver
        return planIcons.basic
    }

    const getPlanColor = (planName: string) => {
        const name = planName.toLowerCase()
        if (name.includes('gold')) return planColors.gold
        if (name.includes('premium')) return planColors.premium
        if (name.includes('silver')) return planColors.silver
        return planColors.basic
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

    if (error || !plans.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 pt-20 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('membershipPlans.noPlans', 'No membership plans available')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t('membershipPlans.noPlansDescription', 'Please check back later for available membership plans.')}
                    </p>
                    <Button onClick={() => navigate('/')}>
                        {t('common.backToHome', 'Back to Home')}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 pt-20">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {t('membershipPlans.title', 'Choose Your')}
                        <span className="text-primary"> {t('membershipPlans.titleHighlight', 'Membership Plan')}</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        {t('membershipPlans.subtitle', 'Unlock exclusive benefits, discounts, and perks with our membership plans. Save more on every order!')}
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
                    {plans.map((plan: any) => {
                        const Icon = getPlanIcon(plan.name)
                        const isSelected = selectedPlanId === plan.id
                        const colorClass = getPlanColor(plan.name)

                        return (
                            <Card
                                key={plan.id}
                                className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl ${isSelected
                                    ? 'ring-4 ring-primary shadow-2xl scale-105'
                                    : 'hover:scale-102'
                                    } ${colorClass}`}
                                onClick={() => handleSelectPlan(plan.id)}
                            >
                                {isSelected && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold">
                                            {t('membershipPlans.selected', 'Selected')}
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-4">
                                    <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Price */}
                                    <div className="text-center py-4 bg-white/50 rounded-lg">
                                        <div className="flex items-baseline justify-center gap-2">
                                            <span className="text-4xl font-bold text-gray-900">
                                                {plan.monthly_fee}
                                            </span>
                                            <span className="text-lg text-gray-600">MAD/month</span>
                                        </div>
                                        {plan.discount_percentage > 0 && (
                                            <Badge variant="secondary" className="mt-2 text-white">
                                                {plan.discount_percentage}% {t('membershipPlans.discount', 'Discount')}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Key Features */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <span>{plan.delivery_slots} {t('membershipPlans.deliverySlots', 'delivery slots per week')}</span>
                                        </div>
                                        {plan.includes_free_desserts && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <span>
                                                    {plan.free_desserts_quantity} {t('membershipPlans.freeDesserts', 'free desserts per week')}
                                                </span>
                                            </div>
                                        )}
                                        {parseFloat(plan.discount_percentage) > 0 && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <span>
                                                    {plan.discount_percentage}% {t('membershipPlans.discountOnOrders', 'discount on all orders')}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Perks */}
                                    {plan.perks && plan.perks.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-sm text-gray-700">
                                                {t('membershipPlans.perks', 'Additional Perks')}:
                                            </h4>
                                            <ul className="space-y-1.5">
                                                {plan.perks.map((perk: string, index: number) => (
                                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                                        <span>{perk}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Billing Info */}
                                    <div className="pt-4 border-t text-xs text-gray-500 text-center">
                                        {t('membershipPlans.billingInfo', 'Billed monthly on day')} {plan.billing_day_of_month}
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={isSelected ? "default" : "outline"}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleSelectPlan(plan.id)
                                        }}
                                    >
                                        {isSelected
                                            ? t('membershipPlans.selected', 'Selected')
                                            : t('membershipPlans.selectPlan', 'Select Plan')}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>

                {/* Continue Button */}
                {selectedPlanId && (
                    <div ref={continueButtonRef} className="text-center sticky bottom-6 z-10">
                        <div className="inline-block bg-white rounded-xl shadow-2xl p-6 border-2 border-primary/20">
                            <Button
                                size="lg"
                                onClick={handleProceedToCheckout}
                                className="px-8 py-6 text-lg font-semibold animate-pulse"
                            >
                                {t('membershipPlans.continue', 'Continue to Checkout')}
                            </Button>
                            <p className="text-sm text-gray-500 mt-4">
                                {t('membershipPlans.cancelAnytime', 'Cancel anytime. No commitments.')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
