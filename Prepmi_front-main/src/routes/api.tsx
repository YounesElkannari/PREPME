import { API_URL } from '../utils';

export const apiRoutes = {
  // ... other routes ...
  login: `${API_URL}/login`,
  logout: `${API_URL}/logout`,
  register: `${API_URL}/register`,
  settings: `${API_URL}/settings`,
  forgotPassword: `${API_URL}/forgot-password`,
  categories: `${API_URL}/categories`,
  users: `${API_URL}/users`,
  meals: `${API_URL}/meals`,
  meals_dashboard: `${API_URL}/meals_dashboard`,
  menus: `${API_URL}/menus`,
  orders: `${API_URL}/orders`,
  plans: `${API_URL}/plans`,
  rewards: `${API_URL}/rewards`,  
  totalPointsEarned: `${API_URL}/total-points-earned`,

  weeklyMenus: `${API_URL}/weekly-menus`,
  menuMeals: `${API_URL}/menu-meals`,
  mealPreparations: `${API_URL}/meal-preparations`,
  updateMealPreparationStatus: (id: number) => `${API_URL}/meal-preparations/${id}/status`,
  nutritionSummary: `${API_URL}/nutrition-summary`,
  dashboard: `${API_URL}/dashboard`,

  // Membership routes
  membershipPlans: `${API_URL}/membership-plans`,
  memberships: `${API_URL}/memberships`,
  membershipTransactions: `${API_URL}/membership-transactions`,

  // Delivery slots routes
  deliverySlots: `${API_URL}/delivery-slots`,

  // Referral/Loyalty routes
  referral_track_share: `${API_URL}/referral/track-share`,
  referral_balances: `${API_URL}/referral/balances`,

  teamPartnerships: `${API_URL}/team-partnerships`,
  collaborations: `${API_URL}/collaborations`,
  mediaUpload: `${API_URL}/media/upload`,
  changePassword: `${API_URL}/change-password`,
  
};
