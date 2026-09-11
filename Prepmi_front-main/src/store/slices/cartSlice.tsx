import { Cart } from '@/interfaces/admin';
import { createSlice } from '@reduxjs/toolkit';
 

const initialState: Cart = {
    products: []
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        addProduct: (state, action) => {
            // test if product already exists in the cart
            const existingProduct = state.products.find((product) => product.id === action.payload.id);
            if (existingProduct) {
                 return state;
            }
            
            // Add default coins_cost if not present (for demo purposes)
            const productWithCoins = {
                ...action.payload,
                coins_cost: action.payload.coins_cost || Math.floor(action.payload.price * 0.1) || 10
            };
            
            state.products.push(productWithCoins);
            return state;
        },
        removeProduct: (state, action) => {
            state.products = state.products.filter((product) => product.id !== action.payload.id);
            return state;
        },
        clearCart: (state) => {
            state.products = [];
            return state;
        }


    },
});

export const { addProduct, removeProduct,clearCart } = cartSlice.actions;

export default cartSlice.reducer;