export interface Admin {
    token?: string
    user?: User
    register?: RegisterForm
    favoris?: Favoris[]
}
export interface Favoris {
    id?: any
}

export interface Specialitie {
    id: any
    name: any
    slug?: string
    description?: string
}
export interface Cart {
    products: Meal[]
}
export interface RegisterForm {

    company_name?: string
    role?: string
    password?: string
    email?: string
    specialitie_id?: number
    interests?: number[]
    phone?: string
    address?: string
    zip_code?: string
    city_id?: string
    country?: string
    agreement?: boolean
    company_logo?: string
    first_name?: string
    last_name?: string

}

export interface User {
    id?: number
    name?: string
    first_name?: string
    last_name?: string
    profile_image_url?: string
    profile_image?: string
    email?: string
    phone?: string
    password?: string
    role?: any
    token?: string
    coins?: number
    address?: string
    company?: string
    is_active?: boolean
    email_verified_at?: string
    role_id?: number
    postal_code?: string
    city?: string
    created_at?: string
    updated_at?: string
    status?: any
}

export interface Plan {
    id?: number
    name: string
    meals_per_week: number
    price_per_week: number
    is_active: boolean
    points_value?: number
    delivery_fee: number
    is_free_shipping: boolean
    created_at?: string
    updated_at?: string
}

export interface DeliverySlot {
    id?: number
    slot_name: string
    slot_type: string
    start_time: string
    end_time: string
    max_capacity: number
    current_bookings?: number
    day_of_week?: string
    is_active: boolean
    price_adjustment?: number
    description?: string
    created_at?: string
    updated_at?: string
}




export interface MembershipPlan {
    id?: number
    name: string
    description?: string
    monthly_fee: number
    discount_percentage?: number
    delivery_slots?: number
    includes_free_desserts?: boolean
    free_desserts_quantity?: number
    perks?: string[]
    is_active: boolean
    billing_day_of_month?: number
    free_delivery?: boolean
    fixed_discount_amount?: number
    has_premium_access?: boolean
    premium_upgrade_fee_min?: number
    premium_upgrade_fee_max?: number
    free_freezes_per_period?: number
    freeze_period_months?: number
    cancellable_anytime?: boolean
    created_at?: string
    updated_at?: string
}

export interface Membership {
    id?: number
    user_id: number
    membership_plan_id: number
    status: 'active' | 'pending' | 'frozen' | 'cancelled'
    started_at?: string
    frozen_at?: string
    cancelled_at?: string
    next_billing_date?: string
    user?: User
    membership_plan?: MembershipPlan
    created_at?: string
    updated_at?: string
}

export interface Reward {
    id?: number
    user_id?: number
    type?: string
    value?: number
    title?: string
    description?: string
    is_used?: boolean
    earned_at?: string
    expires_at?: string
    used_at?: string
    used_order_id?: number
    discount_applied?: number
    conditions?: string
    meal_id?: number

}
export interface joinProcess {
    currentStep: number,
    planData: {
        // Plan selection
        planId?: number
        planName?: string
        protein: string
        categoryId?: number
        categoryName?: string
        category?: Category // Store the complete category object
        portion: string
        mealsPerWeek: number
        pricePerWeek?: number
        deliveryFee?: number
        isFreeShipping?: boolean
        pointsValue?: number
        plan?: Plan // Store the complete plan object

        // Personal details
        firstName: string
        lastName: string
        phoneNumber: string
        country: string
        address: string
        hearAboutUs: string

        // Meal selections
        selectedMeals: Record<string, any>
        selectedBreakfasts: Record<string, any>
        selectedDrinks: Record<string, any>
    }
}

export interface ModalOption {
    handleCancel?: any
    isModalVisible?: any
    isUpdate?: any
}

export interface Company {
    id: string
    name?: string
    email?: string
    phone?: string
    address?: string
    logo?: string
    website?: string
    zip_code?: string
}



export interface Categorie {
    id: any
    name: any
    slug?: string
    description?: string
    family_id?: number
    subcategories?: Categorie[]
}

export interface Category {
    id: any
    name: string
    slug: string
    description?: string
    image?: string | File
    image_url?: string
    is_active: boolean
    created_at?: string
    updated_at?: string
}

export interface Unite {
    id: any
    name: any
    slug?: string
    description?: string
}
export interface Order {
    id: any
    user?: User
    product?: Meal
    quantity: number
    price: number
    note?: string
    address?: string
    payment?: string
    status?: Status
}
export interface Setting {
    id: any
    licence?: string
    expired?: boolean
    expired_date?: Date
    invoice_number?: number
    order_purchase_number?: number
    order_sale_number?: number
    header?: string
    footer?: string
    company_name?: string
}

export interface Status {

    name: any
    color?: "default" | "secondary" | "destructive" | "outline"
}
export interface Nutrition {
    calories: number
    protein: string
    carbohydrates: string
    fats: string
    fiber: string
    sodium: string
    sugar: string
}

export interface DietaryInfo {
    is_vegetarian: boolean
    is_vegan: boolean
    is_gluten_free: boolean
    is_dairy_free: boolean
    is_nut_free: boolean
    is_keto: boolean
    is_paleo: boolean
    is_low_carb: boolean
    is_high_protein: boolean
}

export interface Preparation {
    prep_time_minutes: number
    cooking_time_minutes: number
    total_time_minutes: number
    difficulty_level: number
    instructions: string | null
    storage_instructions: string | null
}

export interface Meal {
    id: any
    name: string
    slug?: string
    description?: string | null
    short_description?: string | null
    image_path?: string | null
    image_url?: string
    gallery_images?: string[]
    gallery_urls?: string[]

    // Pricing & serving
    price: string | number
    cost_per_serving?: string | number
    weight_grams?: number
    serving_size?: string | null

    // Nutritional info (flat structure for form compatibility)
    calories?: number
    protein?: number | string
    carbohydrates?: number | string
    fats?: number | string
    fiber?: number | string
    sodium?: number | string
    sugar?: number | string

    // Ingredients & preparation
    ingredients?: string | string[] | null
    allergens?: string | null
    preparation_instructions?: string | null
    storage_instructions?: string | null

    // Dietary restrictions (flat structure)
    is_vegetarian?: boolean
    is_vegan?: boolean
    is_gluten_free?: boolean
    is_dairy_free?: boolean
    is_nut_free?: boolean
    is_keto?: boolean
    is_paleo?: boolean
    is_low_carb?: boolean
    is_high_protein?: boolean

    // Spice & difficulty
    is_spicy?: boolean
    spice_level?: number
    difficulty_level?: number

    // Timing
    prep_time_minutes?: number
    cooking_time_minutes?: number
    total_time_minutes?: number

    // Chef notes & availability
    chef_notes?: string | null
    available_from?: string | null
    available_to?: string | null
    is_active?: boolean

    // Category & Type
    category_id?: number
    type_id?: number
    type?: string

    // Timestamps
    created_at?: string
    updated_at?: string

    // Nested objects (for backward compatibility with API responses)
    nutrition?: Nutrition
    dietary_info?: DietaryInfo
    preparation?: Preparation

    // Additional fields for frontend use
    image?: string
    available_date?: string
    coins_cost?: number
    quantity?: number
    qte?: number

    // Meal category and tags
    category?: any
    tags?: string[]

    // E-commerce fields
    categorie?: Categorie
    unite?: Unite
    user?: User
    status?: Status
    status_id?: number
    show_company?: boolean
    favaris?: boolean
    relatedProducts?: Meal[]

    // memebership meal
    is_membership?: boolean
}

export interface FormModalProps {
    open: boolean;
    onClose: () => void;
}

export interface MenuMeal {
    id?: number
    weekly_menu_id: number
    meal_id: number
    position: number
    is_featured: boolean
    special_price?: number | null
    availability_count?: number
    sold_count?: number
    created_at?: string
    updated_at?: string
    meal?: Meal
}

export interface WeeklyMenu {
    id?: number
    week_start_date: string
    week_end_date: string
    title: string
    description?: string | null
    is_active: boolean
    is_published: boolean
    published_at?: string | null
    created_by?: number
    created_at?: string
    updated_at?: string
    meals?: MenuMeal[]
}

export interface MealPreparation {
    id: number
    order_id: number
    order?: Order
    meal_id: number
    meal?: Meal
    quantity: number
    preparation_status: 'pending' | 'preparing' | 'ready_for_delivery' | 'delivered' | 'cancelled'
    preparation_date: string
    delivery_date?: string
    notes?: string
    customer_name?: string
    created_at?: string
    updated_at?: string
}

export interface Collaborator {
    id: number
    full_name: string
    social_url_1: string
    social_url_2?: string
    social_url_3?: string
    email: string
    phone: string
    country: string
    created_at?: string
    updated_at?: string
}

export interface Partner {
    id: number
    job_title?: string
    email: string
    first_name: string
    last_name: string
    company_name: string
    company_website?: string
    partnership_type: string
    team_members_per_week: string
    products_interested: string[] // json field, assuming it's an array
    heard_about_us?: string
    accept_terms: boolean
    accept_communications: boolean
    created_at?: string
    updated_at?: string
}
