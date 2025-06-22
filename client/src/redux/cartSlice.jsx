import { createSlice } from '@reduxjs/toolkit';


//const initialState = JSON.parse(localStorage.getItem('cart')) ?? [];
//console.log("initialState:", initialState.length)

const initialState = {
    items: JSON.parse(localStorage.getItem('cart'))?.items ?? []
};
console.log("initialState:", initialState.items.length);



export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            state.items.push(action.payload);
        },
        deleteFromCart(state, action) {

            state.items = state.items.filter(item => item.id !== action.payload.id);
        },
        incrementQuantity(state, action) {
            const item = state.items.find(item => item.id === action.payload);
            if (item) {
                item.quantity++;
            }
        },
        decrementQuantity(state, action) {
            const item = state.items.find(item => item.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity--;
            }
        },
    },
});

// Action creators are generated for each case reducer function
export const { addToCart, deleteFromCart, incrementQuantity, decrementQuantity } = cartSlice.actions;

export default cartSlice.reducer;
































{/*import { createSlice } from '@reduxjs/toolkit'

const initialState = [];

export const cartSlice = createSlice({
    name: 'cart',
    initialState : {
        items: [],},
    reducers: {
        addToCart(state, action) {
            state.push(action.payload)
        },
        deleteFromCart(state, action) {
            return state.filter(item => item.id != action.payload.id);
        },
        incrementQuantity: (state, action) => {
            state = state.map(item => {
                if (item.id === action.payload) {
                    item.quantity++;
                }
                return item;
            });
        },
        decrementQuantity: (state, action) => {
            state = state.map(item => {
                if (item.quantity !== 1) {
                    if (item.id === action.payload) {
                        item.quantity--;
                    }
                }
                return item;

            })
        },
    },
})

// Action creators are generated for each case reducer function
export const { addToCart, deleteFromCart, incrementQuantity, decrementQuantity } = cartSlice.actions

export default cartSlice.reducer*/}