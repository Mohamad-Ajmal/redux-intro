import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    balance: 0,
    loan:0,
    loanpurpose: "",
    isLoading: false,
};



const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        deposit(state, action){
            state.balance +=  action.payload;
        },
        withdraw(state, action){
            state.balance -= action.payload
        },
        requestLoan: {
            prepare(amount, purpose){
                return {
                    payload: { amount, purpose },
                };
            },

            reducer(state, action){
                if(state.loan > 0 ) return;

                state.loan = action.payload.amount;
                state.loanpurpose = action.payload.purpose;
                state.balance = state.balance + action.payload.amount;
            }
        },
        payLoan(state, action){
            state.balance -= state.loan;
            state.loan = 0;
            state.loanpurpose = "";
        }
    }
})
export const {deposit, withdraw, requestLoan, payLoan} = accountSlice.actions
export default accountSlice.reducer;

