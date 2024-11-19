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
            state.isLoading = false;
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
        },
        convertingCurrency(state){
            state.isLoading = true;
        }
    }
})
export const {withdraw, requestLoan, payLoan} = accountSlice.actions
export function deposit(amount, currency){
    if(currency === "USD") return {type: "account/deposit", payload: amount}
    return async function(dispatch, getState){
        dispatch({type:"account/convertingCurrency"});
        // API call
        const rest = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&base=${currency}&symbols=USD`)
        const data = await rest.json();
        const converted = data.rates.USD;

        // return the action
        dispatch ({type: "account/deposit", payload: converted})

    }

}
export default accountSlice.reducer;


