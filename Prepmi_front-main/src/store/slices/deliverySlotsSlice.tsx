import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface DeliverySlot {
    id: number
    slot_name: string
    slot_type: 'membership' | 'normal' | 'both'
    start_time: string
    end_time: string
    max_capacity: number
    current_bookings: number
    day_of_week: number | null // 0=Sunday, 1=Monday, ..., 6=Saturday
    is_active: boolean
    price_adjustment: number
    description: string | null
}

export type DeliverySlotsState = {
    slots: DeliverySlot[]
    isLoading: boolean
    error: string | null
}

const initialState: DeliverySlotsState = {
    slots: [],
    isLoading: false,
    error: null
}

export const deliverySlotsSlice = createSlice({
    name: 'deliverySlots',
    initialState,
    reducers: {
        setDeliverySlots: (state, action: PayloadAction<DeliverySlot[]>) => {
            state.slots = action.payload
            state.isLoading = false
            state.error = null
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload
            state.isLoading = false
        },
        clearError: (state) => {
            state.error = null
        }
    }
})

export const { setDeliverySlots, setLoading, setError, clearError } = deliverySlotsSlice.actions
export default deliverySlotsSlice.reducer
