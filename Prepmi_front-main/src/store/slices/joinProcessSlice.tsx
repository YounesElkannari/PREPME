import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Plan, Category } from '@/interfaces/admin'

export type JoinProcessState = {
  currentStep?: number,
  planData?: {
    // Plan selection
    planId?: number
    planName?: string
    protein?: string
    categoryId?: number
    categoryName?: string
    category?: Category // Store the complete category object
    portion?: string
    mealsPerWeek?: number
    pricePerWeek?: number
    deliveryFee?: number
    isFreeShipping?: boolean
    pointsValue?: number
    plan?: Plan // Store the complete plan object

    // Personal details
    firstName?: string
    email?: string
    password?: string
    repeatPassword?: string
    lastName?: string
    phoneNumber?: string
    country?: string
    address?: string
    hearAboutUs?: string
    delivery_slot_ids?: number[]
    selectedSize?: string
    sizePrice?: number
    // Meal selections
    selectedMeals?: Record<string, any>
    selectedBreakfasts?: Record<string, any>
    selectedDrinks?: Record<string, any>
    selectedFreeDesserts?: Record<string, any>
    selectedFreeMeals?: Record<string, any>
    selectedRewardsMeals?: Record<string, any>
    selectedFreeDrinks?: Record<string, any>
  }
}


const initialState: JoinProcessState = {
  currentStep: 1,
  planData: {
    planId: undefined,
    planName: '',
    protein: '',
    categoryId: undefined,
    categoryName: '',
    category: undefined,
    portion: '',
    mealsPerWeek: undefined,
    pricePerWeek: 0,
    deliveryFee: 0,
    isFreeShipping: false,
    pointsValue: 0,
    plan: undefined,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: 'UK',
    address: '',
    email: '',
    password: '',
    repeatPassword: '',
    hearAboutUs: '',
    selectedSize: '',
    sizePrice: 0,
    delivery_slot_ids: [],
    selectedMeals: {},
    selectedBreakfasts: {},
    selectedDrinks: {},
    selectedRewardsMeals: {},
    selectedFreeMeals: {}
  }
}

export const joinProcessSlice = createSlice({
  name: 'joinProcess',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    updatePlanData: (state: any, action: PayloadAction<Partial<JoinProcessState['planData']>>) => {
      state.planData = { ...state.planData, ...action.payload }
    },
    nextStep: (state: any) => {
      if (state.currentStep < 4) {
        state.currentStep += 1
      }
    },
    prevStep: (state: any) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1
      }
    },
    resetJoinProcess: () => {
      return initialState
    },
    // clear just meal selections
    clearMealSelections: (state) => {
      if (state.planData) {
        state.planData.selectedMeals = {}
        state.planData.selectedBreakfasts = {}
        state.planData.selectedDrinks = {}
        state.planData.selectedRewardsMeals = {}
        state.planData.selectedFreeMeals = {}
      }
    }
  }
})

export const { setCurrentStep, updatePlanData, nextStep, prevStep, resetJoinProcess, clearMealSelections } = joinProcessSlice.actions
export default joinProcessSlice.reducer

