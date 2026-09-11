export interface Meal {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface MenuMeal {
  id: number;
  weekly_menu_id: number;
  meal_id: number;
  position: number;
  is_featured: boolean;
  special_price: number | null;
  availability_count: number;
  sold_count: number;
  created_at: string;
  updated_at: string;
  meal: Meal;
}

export interface WeeklyMenu {
  id: number;
  week_start_date: string;
  week_end_date: string;
  title: string;
  description: string;
  is_active: boolean;
  is_published: boolean;
  published_at: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  meals?: MenuMeal[];
}

export interface WeeklyMenuFormData {
  week_start_date: string;
  week_end_date: string;
  title: string;
  description: string;
  is_active: boolean;
  is_published: boolean;
}

export interface MenuMealFormData {
  meal_id: number;
  position: number;
  is_featured: boolean;
  special_price?: number;
  availability_count: number;
}
