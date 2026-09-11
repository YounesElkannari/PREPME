import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Setting {
    key: string
    value: string
    type: string
    description: string
}

export type SettingsState = {
    settings: Setting[]

}

const initialState: SettingsState = {
    settings: [],

}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettings: (state, action: PayloadAction<Setting[]>) => {
            state.settings = action.payload

        },


    }
})

export const { setSettings } = settingsSlice.actions
export default settingsSlice.reducer