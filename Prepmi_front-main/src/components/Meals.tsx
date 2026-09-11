import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updatePlanData } from "@/store/slices/joinProcessSlice";
import { Meal, Reward } from "@/interfaces/admin";
import { useNavigate } from "react-router-dom";
import { webRoutes } from "@/routes/web";
import { MealsHeader } from "@/components/meals/MealsHeader";
import { PlanSummary } from "@/components/meals/PlanSummary";
import { MealSelector } from "@/components/meals/MealSelector";
import { RewardsSection } from "@/components/meals/RewardsSection";
import { FreeDesserts } from "@/components/meals/FreeDesserts";
import { DrinksSection } from "@/components/meals/DrinksSection";
import { MealsSummary } from "@/components/meals/MealsSummary";

interface MealsProps {
  categoriesData?: any[];
  plansData?: any[];
  membershipData?: any;
  weeklyMenuData?: any;
  mealsData?: Meal[];
  drinksData?: Meal[];
  rewardsData?: any;
  isLoadingCategories?: boolean;
  isLoadingPlans?: boolean;
  isLoadingMembership?: boolean;
  isLoadingMenu?: boolean;
  isLoadingMeals?: boolean;
  isLoadingDrinks?: boolean;
  isLoadingRewards?: boolean;
}

export function Meals({
  membershipData = null,
  weeklyMenuData = null,
  mealsData = [],
  drinksData = [],
  rewardsData = null,

  isLoadingMeals = false,
  isLoadingDrinks = false,
}: MealsProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const planData = useSelector(
    (state: RootState) => state.joinProcess.planData
  );
  const admin = useSelector((state: RootState) => state.admin?.user);

  const [selectedMeals, setSelectedMeals] = useState<{ [key: number]: Meal & { quantity: number } }>(
    planData?.selectedMeals || {}
  );
  const [selectedDrinks, setSelectedDrinks] = useState<{
    [key: number]: Meal & { quantity: number };
  }>(planData?.selectedDrinks || {});
  const [selectedFreeDesserts, setSelectedFreeDesserts] = useState<{
    [key: number]: Meal & { quantity: number };
  }>(planData?.selectedFreeDesserts || {});
  const [showDrinks, setShowDrinks] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [appliedReward, setAppliedReward] = useState<Reward | null>(null);
  const [appliedRewardMeal, setAppliedRewardMeal] = useState<Meal | null>(null);

  // Use props data instead of fetching
  const weeklyMenu = weeklyMenuData;
  const allMeals = mealsData;
  const drinks = drinksData;

  // Filter meals based on selected category and type_id = 1 (Menu)
  const filteredMeals = allMeals.filter((meal: Meal) => {
    // Filter by type_id = 1 (Menu)
    if (meal.type_id !== 1) return false;
    
    // Filter by selected category if one is selected
    if (planData?.categoryId) {
      return meal.category_id === planData.categoryId;
    }
    
    return true;
  });

  // Membership data
  const userMembership = membershipData;
  const membershipPlan = userMembership?.membership_plan || null;
  const hasFreeDesserts = membershipPlan?.includes_free_desserts || false;
  const free_desserts_used_this_month = Number(userMembership?.free_desserts_used_this_month || 0);

  const freeDessertsQuantity = Number(
    membershipPlan?.free_desserts_quantity - free_desserts_used_this_month || 0
  );
  const membershipDiscount = Number(membershipPlan?.discount_percentage || 0);

  // Helper functions for membership checks
  const isUserLoggedIn = () => {
    return admin && admin.id;
  };

  const isUserMember = () => {
    return isUserLoggedIn() && userMembership && userMembership.status === 'active';
  };

  const canAddMealToBasket = (meal: Meal) => {
    // If meal doesn't require membership, anyone can add it
    if (!meal.is_membership) {
      return true;
    }

    // If meal requires membership, check if user is logged in and has active membership
    return isUserMember();
  };

  const handleMembershipRedirect = () => {
    navigate(webRoutes.membership_plans);
  };

  // Get unused free_meal rewards - handle array of rewards
  const availableRewards = (() => {
    const rewardData = rewardsData;

    if (!rewardData) return [];

    // Handle array of rewards
    if (Array.isArray(rewardData)) {
      return rewardData.filter(
        (reward) => reward.type === "free_meal" && !reward.is_used
      );
    }

    // Handle single reward object (fallback)
    if (rewardData.type === "free_meal" && !rewardData.is_used) {
      return [rewardData];
    }

    return [];
  })();
  console.log("Available Rewards:", availableRewards);
  // Filter meals that are eligible for reward - show all filtered meals (not just by price)
  const getRewardEligibleMeals = (_reward: Reward) => {
    // Return all filtered meals (respecting category and type), not filtered by price or membership
    return filteredMeals.filter((meal: Meal) => {
      // Don't filter by price anymore, just return filtered meals
      // Optionally exclude membership-only meals
      return !meal.is_membership;
    });
  };

  // Update local state when Redux state changes
  useEffect(() => {
    if (planData) {
      setSelectedMeals(planData.selectedMeals || {});
      setSelectedDrinks(planData.selectedDrinks || {});
    }
  }, [planData]);

  // Calculate total selected meals using new structure
  const totalSelectedMeals = Object.values(selectedMeals).reduce(
    (sum, meal: any) => sum + (meal.quantity || 0),
    0
  );
  const remainingMeals = (planData?.mealsPerWeek || 10) - totalSelectedMeals;

  // Update selectedMeals to store full meal object with quantity
  const handleMealQuantityChange = (mealId: number, change: number) => {
    const mealObj = allMeals.find((m) => m.id === mealId);
    if (!mealObj) return;

    setSelectedMeals((prev: any) => {
      const currentQty = prev[mealId]?.quantity || 0;
      // Recalculate remainingMeals based on new structure
      const totalSelected: any = Object.values(prev).reduce(
        (sum, meal: any) => sum + (meal.quantity || 0),
        0
      );
      const remaining = (planData?.mealsPerWeek || 10) - totalSelected;
      const newQty = Math.max(
        0,
        Math.min(currentQty + change, remaining + currentQty)
      );

      let newSelectedMeals;
      if (newQty === 0) {
        const { [mealId]: removed, ...rest } = prev;
        newSelectedMeals = rest;
      } else {
        newSelectedMeals = {
          ...prev,
          [mealId]: {
            ...mealObj,
            quantity: newQty,
          },
        };
      }

      dispatch(updatePlanData({ selectedMeals: newSelectedMeals }));
      return newSelectedMeals;
    });
  };

  // Update selectedDrinks to store full drink object with quantity
  const handleDrinkQuantityChange = (itemId: number, change: number) => {
    const drinkObj = drinks.find((d) => d.id === itemId);
    if (!drinkObj) return;

    setSelectedDrinks((prev: any) => {
      const currentQty = prev[itemId]?.quantity || 0;
      const newQty = Math.max(0, currentQty + change);

      let newSelectedDrinks;
      if (newQty === 0) {
        const { [itemId]: removed, ...rest } = prev;
        newSelectedDrinks = rest;
      } else {
        newSelectedDrinks = {
          ...prev,
          [itemId]: {
            ...drinkObj,
            quantity: newQty,
          },
        };
      }

      dispatch(updatePlanData({ selectedDrinks: newSelectedDrinks }));
      return newSelectedDrinks;
    });
  };

  // Handle free desserts from membership
  const handleFreeDessertQuantityChange = (itemId: number, change: number) => {
    const drinkObj = drinks.find((d) => d.id === itemId);
    if (!drinkObj) return;

    setSelectedFreeDesserts((prev: any) => {
      const currentQty = prev[itemId]?.quantity || 0;
      const totalFreeDesserts = Object.values(prev).reduce(
        (sum: number, drink: any) => sum + (drink.quantity || 0),
        0
      );
      const remainingFreeDesserts = freeDessertsQuantity - totalFreeDesserts;
      const newQty = Math.max(
        0,
        Math.min(currentQty + change, remainingFreeDesserts + currentQty)
      );

      let newSelectedFreeDesserts;
      if (newQty === 0) {
        const { [itemId]: removed, ...rest } = prev;
        newSelectedFreeDesserts = rest;
      } else {
        newSelectedFreeDesserts = {
          ...prev,
          [itemId]: {
            ...drinkObj,
            quantity: newQty,
          },
        };
      }

      dispatch(updatePlanData({ selectedFreeDesserts: newSelectedFreeDesserts }));
      return newSelectedFreeDesserts;
    });
  };

  // Helper: get selected meal objects with quantity
  const selectedMealObjects = Object.values(selectedMeals || {});

  // Helper: get selected drink objects with quantity
  const selectedDrinkObjects = Object.values(selectedDrinks || {});

  const handleApplyReward = (mealId: number, rewardId: number) => {
    const reward = availableRewards.find((r) => r.id === rewardId);
    const selectedMeal = allMeals.find((m: Meal) => m.id === mealId);
    if (!reward || !selectedMeal) return;

    setAppliedReward(reward);
    setAppliedRewardMeal(selectedMeal);
    dispatch(
      updatePlanData({
        selectedRewardsMeals: {
          rewardId: reward.id,
          mealId: mealId,
          mealName: selectedMeal.name,
          mealPrice: selectedMeal.price,
          mealImage: selectedMeal.image_url || selectedMeal.image_path,
          mealCalories: selectedMeal.calories,
          mealProtein: selectedMeal.protein,
          mealDescription:
            selectedMeal.short_description || selectedMeal.description,
        },
      })
    );
    setShowRewards(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <MealsHeader weeklyMenu={weeklyMenu} />

      {/* Plan Summary */}
      <PlanSummary
        planData={planData}
        totalSelectedMeals={totalSelectedMeals}
        userMembership={userMembership}
        membershipPlan={membershipPlan}
        hasFreeDesserts={hasFreeDesserts}
        freeDessertsQuantity={freeDessertsQuantity}
        membershipDiscount={membershipDiscount}
        selectedFreeDesserts={selectedFreeDesserts}
        availableRewards={availableRewards}
      />

      {/* Remaining Meals Counter */}
      {remainingMeals > 0 && (
        <div className="text-center">
          <Badge
            variant="outline"
            className="text-lg px-4 py-2 border-primary text-primary"
          >
            {t("joinNow.meals.mealsRemaining", { count: remainingMeals })}
          </Badge>
        </div>
      )}

      {/* All Meals Grid - Fetched from API */}
      <MealSelector
        allMeals={filteredMeals}
        isLoadingMeals={isLoadingMeals}
        selectedMeals={selectedMeals}
        remainingMeals={remainingMeals}
        canAddMealToBasket={canAddMealToBasket}
        handleMealQuantityChange={handleMealQuantityChange}
        handleMembershipRedirect={handleMembershipRedirect}
      />

      {/* Rewards Section */}
      <RewardsSection
        availableRewards={availableRewards}
        showRewards={showRewards}
        setShowRewards={setShowRewards}
        appliedReward={appliedReward}
        getRewardEligibleMeals={getRewardEligibleMeals}
        handleApplyReward={handleApplyReward}
      />

      {/* Free Desserts Section (Membership Benefit) */}
      <FreeDesserts
        hasFreeDesserts={hasFreeDesserts}
        freeDessertsQuantity={freeDessertsQuantity}
        membershipPlan={membershipPlan}
        drinks={drinks}
        isLoadingDrinks={isLoadingDrinks}
        selectedFreeDesserts={selectedFreeDesserts}
        handleFreeDessertQuantityChange={handleFreeDessertQuantityChange}
      />

      {/* Drinks Section */}
      <DrinksSection
        drinks={drinks}
        isLoadingDrinks={isLoadingDrinks}
        showDrinks={showDrinks}
        setShowDrinks={setShowDrinks}
        selectedDrinks={selectedDrinks}
        handleDrinkQuantityChange={handleDrinkQuantityChange}
      />

      {/* Selected Meals Summary */}
      <MealsSummary
        selectedMealObjects={selectedMealObjects}
        selectedDrinkObjects={selectedDrinkObjects}
        selectedFreeDesserts={selectedFreeDesserts}
        hasFreeDesserts={hasFreeDesserts}
        appliedReward={appliedReward}
        appliedRewardMeal={appliedRewardMeal}
      />
    </div>
  );
}
