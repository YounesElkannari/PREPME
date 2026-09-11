import { Plan } from "@/components/Plan"
import { Meals } from "@/components/Meals"
import { Address } from "@/components/Address"
import { Payment } from "@/components/Payment"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/store"
import { nextStep, prevStep } from "@/store/slices/joinProcessSlice"
import { setSettings } from "@/store/slices/settingsSlice"
import { useEffect } from "react"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { apiRoutes } from "@/routes/api"
import { handleErrorResponse } from "@/utils"
import http from "@/utils/http"

const isValidMoroccanPhone = (phone: string): boolean => {
  const clean = String(phone || "").replace(/\D/g, "")
  // Local: 06XXXXXXXX / 07XXXXXXXX (10 digits)
  if (/^0[67]\d{8}$/.test(clean)) return true
  // International: 212 6XXXXXXXX / 212 7XXXXXXXX (12 digits, no leading 0 after 212)
  if (/^212[67]\d{8}$/.test(clean)) return true
  return false
}

const JoinNow = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { currentStep = 1, planData } = useSelector(
    (state: RootState) => state.joinProcess
  )
  const admin = useSelector((state: RootState) => state.admin?.user)
  const settings = useSelector((state: RootState) => state.settings)

  const { isLoading: isLoadingDeliverySlots, data: deliverySlotsResponse } =
    useQuery<{ data: any[] }>({
      queryKey: ["delivery-slots"],
      queryFn: () =>
        http
          .get(apiRoutes.deliverySlots)
          .then((res) => res.data)
          .catch((e) => {
            handleErrorResponse(e)
            throw e
          }),
      staleTime: 0,
      gcTime: 0,
    })

  const { isLoading: isLoadingCategories, data: categoriesResponse } = useQuery<{
    data: any[]
  }>({
    queryKey: ["categories"],
    queryFn: () =>
      http
        .get(apiRoutes.categories)
        .then((res) => res.data)
        .catch((e) => {
          handleErrorResponse(e)
          throw e
        }),
    staleTime: 0,
    gcTime: 0,
  })

  const { isLoading: isLoadingPlans, data: plansResponse } = useQuery<{
    data: any[]
  }>({
    queryKey: ["plans"],
    queryFn: () =>
      http
        .get(apiRoutes.plans)
        .then((res) => res.data)
        .catch((e) => {
          handleErrorResponse(e)
          throw e
        }),
    staleTime: 0,
    gcTime: 0,
  })

  const { data: membershipResponse, isLoading: isLoadingMembership } = useQuery(
    {
      queryKey: ["user-membership", admin?.id],
      queryFn: () =>
        http
          .get(`${apiRoutes.memberships}?user_id=${admin?.id}&status=active`)
          .then((res) => {
            const memberships = res.data.data ?? res.data
            return Array.isArray(memberships) ? memberships[0] : null
          })
          .catch(() => null),
      enabled: !!admin?.id,
      staleTime: 0,
      gcTime: 0,
    }
  )

  useQuery({
    queryKey: ["settings", admin?.id],
    queryFn: () =>
      http
        .get(apiRoutes.settings)
        .then((res) => {
          dispatch(setSettings(res.data.data || res.data))
          return res.data
        })
        .catch(() => null),
  })

  const { isLoading: isLoadingMeals, data: mealsResponse } = useQuery<{
    data: any[]
  }>({
    queryKey: [
      "meals",
      membershipResponse ? "with-membership" : "no-membership",
    ],
    queryFn: () =>
      http
        .get(
          `${apiRoutes.meals}?active=1&type_id=1&is_membership=${
            membershipResponse ? "1" : ""
          }`
        )
        .then((res) => res.data)
        .catch((e) => {
          handleErrorResponse(e)
          throw e
        }),
    staleTime: 0,
    gcTime: 0,
  })

  const { isLoading: isLoadingDrinks, data: drinksResponse } = useQuery<{
    data: any[]
  }>({
    queryKey: ["meals", "drinks"],
    queryFn: () =>
      http
        .get(`${apiRoutes.meals}?type_id=3`)
        .then((res) => res.data)
        .catch((e) => {
          handleErrorResponse(e)
          throw e
        }),
    staleTime: 0,
    gcTime: 0,
  })

  const { isLoading: isLoadingRewards, data: rewardsResponse } = useQuery<any>({
    queryKey: ["rewards", admin?.id],
    queryFn: () =>
      http
        .get(apiRoutes.rewards)
        .then((res) => res.data)
        .catch((error) => {
          handleErrorResponse(error)
          throw error
        }),
    enabled: !!admin?.id,
    staleTime: 0,
    gcTime: 0,
  })

  const { isLoading: isLoadingLoyaltyBalances, data: loyaltyBalances } =
    useQuery<any>({
      queryKey: ["loyalty-balances", admin?.id],
      queryFn: () =>
        http.get(apiRoutes.referral_balances).then((res) => res.data),
      enabled: !!admin?.id,
      staleTime: 0,
      gcTime: 0,
    })

  const steps = [
    {
      id: 1,
      title: t("joinNow.steps.plan"),
      subtitle: "Choisissez votre formule",
      component: Plan,
    },
    {
      id: 2,
      title: t("joinNow.steps.meals"),
      subtitle: "Sélectionnez vos plats",
      component: Meals,
    },
    {
      id: 3,
      title: t("joinNow.steps.address"),
      subtitle: "Livraison & Compte",
      component: Address,
    },
    {
      id: 4,
      title: t("joinNow.steps.payment"),
      subtitle: "Validation & Paiement",
      component: Payment,
    },
  ]

  useEffect(() => {
    window.scrollTo({ top: 100, behavior: "smooth" })
  }, [currentStep])

  const handleNext = () => {
    if (currentStep === 1) {
      if (!planData?.protein || planData?.protein === "") {
        toast.error(t("joinNow.validation.selectProtein"))
        return
      }

      const orderSizes = settings.settings.find((s) => s.key === "order_sizes")
        ?.value
      const parsedOrderSizes = orderSizes ? JSON.parse(orderSizes) : []
      if (
        parsedOrderSizes.length > 0 &&
        (!planData?.selectedSize || planData?.selectedSize === "")
      ) {
        toast.error(t("joinNow.validation.selectSize"))
        return
      }

      if (!planData?.mealsPerWeek || planData?.mealsPerWeek === 0) {
        toast.error(t("joinNow.validation.selectPlan"))
        return
      }
    }

    if (currentStep === 2) {
      const selectedMealsCount = planData?.selectedMeals
        ? Object.values(planData.selectedMeals).reduce(
            (sum, meal: any) => sum + (meal.quantity || 0),
            0
          )
        : 0
      if (
        !planData?.mealsPerWeek ||
        selectedMealsCount < planData?.mealsPerWeek
      ) {
        toast.error(
          t(
            "joinNow.validation.selectAllMeals",
            "Please select all your meals before continuing."
          )
        )
        return
      }
    }

    if (currentStep === 3) {
      if (
        !planData?.firstName ||
        !planData?.lastName ||
        !planData?.phoneNumber ||
        !planData?.address
      ) {
        toast.error(
          t(
            "joinNow.validation.fillAllFields",
            "Please fill in all required fields."
          )
        )
        return
      }

      if (!isValidMoroccanPhone(planData.phoneNumber)) {
        toast.error(
          t(
            "joinNow.validation.invalidPhone",
            "Numéro invalide. Format: 06/07XXXXXXXX ou +212 6/7XXXXXXXX"
          )
        )
        return
      }

      if (
        !planData?.delivery_slot_ids ||
        planData?.delivery_slot_ids.length === 0
      ) {
        toast.error(
          t(
            "joinNow.validation.selectDeliverySlot",
            "Please select at least one delivery time slot."
          )
        )
        return
      }

      if (!admin?.id) {
        if (!planData?.email || !planData?.password) {
          toast.error(
            t(
              "joinNow.validation.fillAccountFields",
              "Please fill in email and password."
            )
          )
          return
        }
        if (planData?.password !== planData?.repeatPassword) {
          toast.error(
            t(
              "joinNow.validation.passwordMismatch",
              "Passwords do not match."
            )
          )
          return
        }
      }
    }

    dispatch(nextStep())
  }

  const handlePrev = () => {
    dispatch(prevStep())
  }

  const CurrentStepComponent = steps.find((step) => step.id === currentStep)
    ?.component

  const getComponentProps = () => {
    const commonProps = {
      categoriesData: categoriesResponse?.data || [],
      plansData: plansResponse?.data || [],
      membershipData: membershipResponse || null,
      isLoadingCategories,
      isLoadingPlans,
      isLoadingMembership,
    }

    switch (currentStep) {
      case 1:
        return commonProps
      case 2:
        return {
          ...commonProps,
          mealsData: mealsResponse?.data || [],
          drinksData: drinksResponse?.data || [],
          rewardsData: rewardsResponse,
          isLoadingMeals,
          isLoadingDrinks,
          isLoadingRewards,
        }
      case 3:
        return {
          deliverySlotsData: deliverySlotsResponse?.data || [],
          membershipData: membershipResponse || null,
          isLoadingDeliverySlots,
        }
      case 4:
        return {
          membershipData: membershipResponse || null,
          pointsData: loyaltyBalances?.order_points_balance || 0,
          isLoadingPoints: isLoadingLoyaltyBalances,
          deliverySlotsData: deliverySlotsResponse?.data || [],
          mealsData: mealsResponse?.data || [],
          freeMealCredits: loyaltyBalances?.free_meal_credits || 0,
          sharePointsBalance: loyaltyBalances?.share_points_balance || 0,
          orderPointsThreshold: loyaltyBalances?.order_points_threshold || 12,
          sharePointsThreshold: loyaltyBalances?.share_points_threshold || 50,
          isLoadingLoyaltyBalances,
        }
      default:
        return {}
    }
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pt-20 pb-24">
      <div className="container mx-auto max-w-5xl px-4 py-6">
        <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Étape {currentStep} sur {steps.length}
              </span>
              <h1 className="text-xl font-bold text-slate-900">
                {steps[currentStep - 1]?.title}
              </h1>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-500">
              {Math.round((currentStep / steps.length) * 100)}% complété
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <div key={step.id} className="flex flex-col space-y-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted
                        ? "bg-primary"
                        : isCurrent
                        ? "bg-primary/70 animate-pulse"
                        : "bg-slate-100"
                    }`}
                  />
                  <div className="hidden items-center space-x-2 sm:flex">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isCompleted || isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isCurrent
                          ? "font-bold text-slate-900"
                          : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
          {CurrentStepComponent && (
            <CurrentStepComponent {...getComponentProps()} />
          )}
        </div>

        <div className="hidden items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:flex">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("joinNow.navigation.previous")}
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            {t("joinNow.navigation.next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-t border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur-md md:hidden">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex-1 border-slate-200 text-slate-700"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Retour
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length}
            className="flex-1 bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Suivant
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  )
}

export default JoinNow 