import { RegisterForm } from '@/interfaces/admin';
import { createSlice } from '@reduxjs/toolkit';


const initialState: RegisterForm =
{
    company_name: '',
    role: '',
    password: '',
    email: '',
    specialitie_id: 0,
    interests: [],
    phone: '',
    address: '',
    zip_code: '',
    city_id: '',
    country: '',
    agreement: false,
    company_logo: '',
    first_name: '',
    last_name: '',
};


export const registerSlice = createSlice({
    name: 'register',
    initialState: initialState,
    reducers: {

        register: (state, action) => {
            state = {
                ...state,
                [action.payload.key]: action.payload.value,
            };

            return state;
        },
        toggleInterests: (state: any, action) => {
            if (state.interests.includes(action.payload)) {
                state.interests = state.interests.filter((id: any) => id !== action.payload);
            } else {
                state.interests.push(action.payload);
            }
            return state;
        },
        restRegister: (state) => {
            state = initialState;
            return state;
        }


    },
});

export const { register, toggleInterests, restRegister } = registerSlice.actions;

export default registerSlice.reducer;