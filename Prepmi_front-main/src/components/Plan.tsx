import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { clearMealSelections, updatePlanData } from "@/store/slices/joinProcessSlice"
import type { Plan as PlanType } from "@/interfaces/admin"
import { Check, ImageIcon } from "lucide-react"
import { API_URL } from "@/utils"

interface PlanProps {
    categoriesData?: any[]
    plansData?: any[]
    membershipData?: any
    isLoadingCategories?: boolean
    isLoadingPlans?: boolean
}

// Helper function to resolve category image URL safely
const resolveCategoryImageUrl = (category: any): string | null => {
    if (!category) return null;
    
    // Prefer image_url if it exists (full URL from backend)
    if (category.image_url && category.image_url.trim() !== '') {
        return category.image_url;
    }
    
    // Fallback to image field (might be relative path)
    if (category.image && category.image.trim() !== '') {
        const imagePath = category.image.startsWith('/') ? category.image : `/${category.image}`;
        return `${API_URL}${imagePath}`;
    }
    
    return null;
};

export const Plan = ({
    categoriesData = [],
    plansData = [],
    membershipData = null,
    isLoadingCategories = false,
    isLoadingPlans = false,

}: PlanProps) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const planData = useSelector((state: RootState) => state.joinProcess.planData)
    const settings = useSelector((state: RootState) => state.settings)

    const [selectedProtein, setSelectedProtein] = useState(planData?.protein || '')
    const [selectedPortion, setSelectedPortion] = useState(planData?.portion || '')
    const [selectedMeals, setSelectedMeals] = useState(planData?.mealsPerWeek ?? '')
    const [selectedSize, setSelectedSize] = useState(planData?.selectedSize || '')

    // Get order sizes from settings
    const orderSizes = settings.settings?.find(s => s.key === 'order_sizes')?.value
    const parsedOrderSizes = orderSizes ? JSON.parse(orderSizes) : []

    // Update local state when Redux state changes
    useEffect(() => {
        if (planData) {
            setSelectedProtein(planData.protein || '')
            setSelectedPortion(planData.portion || '')
            setSelectedMeals(planData.mealsPerWeek ?? '')
            setSelectedSize(planData.selectedSize || '')
        }
    }, [planData])

    // Use props data instead of fetching
    const categories = categoriesData;
    const plans = plansData;
    const userMembership = membershipData;
    const membershipPlan = userMembership?.membership_plan || null;

    // Map plans to meal options format
    const mealOptions: PlanType[] = plans;

    const handleProteinSelect = (proteinId: string) => {
        const selectedCategory = categories.find(cat => cat.id?.toString() === proteinId)
        setSelectedProtein(proteinId)
        dispatch(updatePlanData({
            protein: proteinId,
            categoryId: selectedCategory?.id,
            categoryName: selectedCategory?.name,
            category: selectedCategory // Store the complete category object
        }))
    }

    const handleMealSelect = (meals: number) => {
        dispatch(clearMealSelections())

        const selectedPlan = mealOptions.find(plan => plan.meals_per_week === meals)

        if (selectedPlan) {
            setSelectedMeals(meals)
            dispatch(updatePlanData({
                planId: selectedPlan.id,
                planName: selectedPlan.name,
                mealsPerWeek: selectedPlan.meals_per_week,
                pricePerWeek: Number(selectedPlan.price_per_week),
                deliveryFee: Number(selectedPlan.delivery_fee || 0),
                isFreeShipping: selectedPlan.is_free_shipping,
                pointsValue: selectedPlan.points_value,
                plan: selectedPlan // Store the complete plan object
            }))
        }
    }

    const handleSizeSelect = (size: string, price: number) => {
        setSelectedSize(size)
        dispatch(updatePlanData({ selectedSize: size, sizePrice: price }))
    }

    const calculateTotal = () => {
        const mealsNum = typeof selectedMeals === 'number' ? selectedMeals : Number(selectedMeals) || 0;
        const selectedPlan = mealOptions.find(plan => plan.meals_per_week === mealsNum);
        const portionExtra = selectedPortion && selectedPortion !== 'standard' ? 1.99 * mealsNum : 0;
        const pricePerWeek = Number(selectedPlan?.price_per_week || 0);
        const sizePrice = Number(planData?.sizePrice || 0);
        const subtotal = pricePerWeek + portionExtra + sizePrice;

        // Calculate membership discount
        const membershipDiscountPercent = membershipPlan ? Number(membershipPlan.discount_percentage || 0) : 0;
        const membershipFixedDiscount = membershipPlan ? Number(membershipPlan.fixed_discount_amount || 0) : 0;

        let membershipDiscount = 0;
        let discountType = 'none';

        if (membershipDiscountPercent > 0) {
            membershipDiscount = (subtotal * membershipDiscountPercent) / 100;
            discountType = 'percentage';
        } else if (membershipFixedDiscount > 0) {
            membershipDiscount = membershipFixedDiscount;
            discountType = 'fixed';
        }

        // Apply membership benefits for delivery
        const hasFreeDesserts = membershipPlan?.includes_free_desserts || false;
        const freeDessertsQuantity = Number(membershipPlan?.free_desserts_quantity || 0);

        // Check if membership provides free delivery or if plan has free shipping
        const isFreeDelivery = selectedPlan?.is_free_shipping || (membershipPlan && (membershipDiscountPercent >= 10 || membershipFixedDiscount >= 5));
        const delivery = isFreeDelivery ? 0 : Number(selectedPlan?.delivery_fee || 0);

        const finalSubtotal = subtotal - membershipDiscount;
        const total = finalSubtotal + delivery;

        return {
            subtotal,
            membershipDiscount,
            membershipDiscountPercent,
            membershipFixedDiscount,
            discountType,
            delivery,
            total,
            hasFreeDesserts,
            freeDessertsQuantity,
            isFreeDelivery
        };
    }

    const totals = calculateTotal()

    return (
        <div className="min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {t('plan.title')}
                        <span className="text-primary"> {t('plan.titleHighlight')}</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {t('plan.subtitle')}
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Protein Preference */}
                    <div className="space-y-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold text-xl mb-4">
                                1
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                {t('plan.protein.title')}
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                {t('plan.protein.subtitle')}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {isLoadingCategories ? (
                                // Loading skeleton
                                Array.from({ length: 4 }).map((_, index) => (
                                    <Card key={index} className="border-2 border-gray-200 overflow-hidden">
                                        <div className="aspect-square bg-gray-200 animate-pulse"></div>
                                        <CardContent className="p-4 text-center">
                                            <div className="h-4 bg-gray-200 rounded mx-auto w-3/4"></div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                categories.map((category: any) => {
                                    const imageUrl = resolveCategoryImageUrl(category);
                                    const isSelected = selectedProtein === category.id?.toString();
                                    
                                    return (
                                        <Card
                                            key={category.id}
                                            className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 overflow-hidden ${
                                                isSelected
                                                    ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20'
                                                    : 'border-gray-200 hover:border-primary/30'
                                                }`}
                                            onClick={() => handleProteinSelect(category.id?.toString())}
                                        >
                                            {/* Image section */}
                                            <div className="aspect-square relative bg-gray-100">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                        <ImageIcon className="w-12 h-12 text-gray-400" />
                                                    </div>
                                                )}
                                                
                                                {/* Selected badge */}
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1.5 shadow-md">
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Category name */}
                                            <CardContent className="p-4 text-center">
                                                <h3 className="text-base font-semibold text-gray-900 truncate">
                                                    {category.name}
                                                </h3>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Order Size Selection */}
                    {parsedOrderSizes.length > 0 && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold text-xl mb-4">
                                    1.5
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    {t('plan.size.title', 'Choose Your Order Size')}
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    {t('plan.size.subtitle', 'Select the size that best fits your needs')}
                                </p>
                            </div>

                            <div className="flex flex-row justify-center gap-6 mb-12">
                                {parsedOrderSizes.map((sizeObj: { size: string; price: number }) => (
                                    <Card
                                        key={sizeObj.size}
                                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${selectedSize === sizeObj.size
                                            ? 'border-primary bg-primary/10 shadow-lg'
                                            : 'border-gray-200 hover:border-primary/30'
                                            }`}
                                        onClick={() => handleSizeSelect(sizeObj.size, sizeObj.price)}
                                    >
                                        <CardContent className="p-8 text-center">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 capitalize">{sizeObj.size}</h3>
                                            <p className="text-gray-600 mb-2">
                                                {sizeObj.size === 'small' ? t('plan.size.small_desc', 'Perfect for individuals or couples') : t('plan.size.large_desc', 'Ideal for families or meal prepping')}
                                            </p>
                                            <div className="text-lg font-bold text-primary">
                                                {sizeObj.price > 0 ? `+${t('menu.currency')}${sizeObj.price.toFixed(2)}` : t('plan.summary.free')}
                                            </div>
                                            {selectedSize === sizeObj.size && (
                                                <div className="mt-4">
                                                    <Badge className="bg-primary text-primary-foreground">{t('common.selected')}</Badge>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Meals Per Week */}
                    <div className="space-y-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold text-xl mb-4">
                                {parsedOrderSizes.length > 0 ? '2' : '2'}
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                {t('plan.meals.title')}
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                {t('plan.meals.subtitle')}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                            {isLoadingPlans ? (
                                // Loading skeleton
                                Array.from({ length: 6 }).map((_, index) => (
                                    <Card key={index} className="border-2 border-gray-200">
                                        <CardContent className="p-6 text-center">
                                            <div className="animate-pulse">
                                                <div className="h-8 bg-gray-200 rounded mb-2 mx-auto w-1/2"></div>
                                                <div className="h-4 bg-gray-200 rounded mb-1 mx-auto w-3/4"></div>
                                                <div className="h-5 bg-gray-200 rounded mx-auto w-2/3"></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                mealOptions.filter(plan => plan.is_active).map((plan) => (
                                    <Card
                                        key={plan.id}
                                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${selectedMeals === plan.meals_per_week
                                            ? 'border-primary bg-primary/10 shadow-lg'
                                            : 'border-gray-200 hover:border-primary/30'
                                            }`}
                                        onClick={() => handleMealSelect(plan.meals_per_week)}
                                    >
                                        <CardContent className="p-6 text-center">
                                            <div className="text-3xl font-bold text-gray-900 mb-2">{plan.meals_per_week}</div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                {plan.name}
                                            </div>
                                            <div className="text-lg font-bold text-primary">
                                                {t('menu.currency')} {Number(plan.price_per_week).toFixed(2)}/{t('common.week')}
                                            </div>
                                            {plan.is_free_shipping && (
                                                <Badge className="mt-2 bg-green-500 text-white text-xs">{t('plan.summary.free')} {t('plan.summary.delivery')}</Badge>
                                            )}
                                            {selectedMeals === plan.meals_per_week && (
                                                <div className="mt-3">
                                                    <Badge className="bg-primary text-primary-foreground">{t('common.selected')}</Badge>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Order Summary */}
                        <Card className="bg-white border-2 border-gray-100 shadow-xl max-w-2xl mx-auto">
                            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                                <CardTitle className="text-2xl font-bold text-center">{t('plan.summary.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                {/* Membership Benefits Section */}
                                {userMembership && membershipPlan && (
                                    <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                                        <h3 className="font-bold text-lg text-green-800 mb-3 flex items-center">
                                            <Check className="w-5 h-5 mr-2" />
                                            {membershipPlan.name} Benefits
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            {totals.discountType === 'percentage' && totals.membershipDiscountPercent > 0 && (
                                                <div className="flex items-center text-green-700">
                                                    <Check className="w-4 h-4 mr-1" />
                                                    {totals.membershipDiscountPercent}% discount on meals
                                                </div>
                                            )}
                                            {totals.discountType === 'fixed' && totals.membershipFixedDiscount > 0 && (
                                                <div className="flex items-center text-green-700">
                                                    <Check className="w-4 h-4 mr-1" />
                                                    {t('menu.currency')}{totals.membershipFixedDiscount.toFixed(2)} discount on meals
                                                </div>
                                            )}
                                            {totals.hasFreeDesserts && (
                                                <div className="flex items-center text-green-700">
                                                    <Check className="w-4 h-4 mr-1" />
                                                    {totals.freeDessertsQuantity} free desserts/month
                                                </div>
                                            )}
                                            {totals.isFreeDelivery && (
                                                <div className="flex items-center text-green-700">
                                                    <Check className="w-4 h-4 mr-1" />
                                                    Free delivery
                                                </div>
                                            )}
                                            {membershipPlan.perks && membershipPlan.perks.slice(0, 2).map((perk: string, index: number) => (
                                                <div key={index} className="flex items-center text-green-700">
                                                    <Check className="w-4 h-4 mr-1" />
                                                    {perk}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="font-semibold text-gray-700">{t('plan.summary.pricePerMeal')}</span>
                                        <div className="text-right">
                                            <span className="font-bold text-xl text-primary">
                                                {(() => {
                                                    const mealsNum = typeof selectedMeals === 'number' ? selectedMeals : Number(selectedMeals) || 0;
                                                    const pricePerWeek = Number(mealOptions.find(o => o.meals_per_week === mealsNum)?.price_per_week || 0);
                                                    return mealsNum > 0 ? (pricePerWeek / mealsNum).toFixed(2) : '0.00';
                                                })()}
                                                {t('menu.currency')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-700">{t('plan.summary.mainMeals')} ({selectedMeals})</span>
                                        <div className="text-right">
                                            <span className="font-semibold text-lg">
                                                {(totals.subtotal - (planData?.sizePrice || 0)).toFixed(2)}
                                                {t('menu.currency')}
                                            </span>
                                        </div>
                                    </div>

                                    {(planData?.sizePrice || 0) > 0 && (
                                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                            <span className="text-gray-700 capitalize">{t('plan.summary.size', 'Size')} ({planData?.selectedSize})</span>
                                            <div className="text-right">
                                                <span className="font-semibold text-lg">
                                                    +{(planData?.sizePrice || 0).toFixed(2)}
                                                    {t('menu.currency')}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {totals.membershipDiscount > 0 && (
                                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                            <span className="text-green-600 font-medium">
                                                Membership Discount {totals.discountType === 'percentage' ? `(${totals.membershipDiscountPercent}%)` : `(${t('menu.currency')}${totals.membershipFixedDiscount.toFixed(2)})`}
                                            </span>
                                            <span className="font-semibold text-green-600">
                                                -{totals.membershipDiscount.toFixed(2)}
                                                {t('menu.currency')}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-700">{t('plan.summary.delivery')}</span>
                                        <div className="text-right">
                                            {totals.delivery > 0 ? (
                                                <span className="font-semibold">{t('menu.currency')}{totals.delivery.toFixed(2)}</span>
                                            ) : (
                                                <span className="font-semibold text-green-600">
                                                    {t('plan.summary.free')}
                                                    {totals.isFreeDelivery && membershipPlan && ' (Membership)'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-primary/10 p-6 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-gray-900">{t('plan.summary.total')}</span>
                                            <div className="text-right">
                                                <span className="text-3xl font-bold text-primary">{t('menu.currency')}{totals.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>


                    </div>
                </div>
            </div>
        </div>
    )
}
