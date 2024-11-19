const initialStateAccount = {
    balance: 0,
    loan:0,
    loanpurpose: "",
    isLoading: false,
};


export default function accountReducer(state = initialStateAccount, action){
    switch(action.type){
       case "account/deposit":
           return {
               ...state,
               balance: state.balance + action.payload,
               isLoading: false,
           };
       case "account/withdraw":
           return {
               ...state,
               balance: state.balance - action.payload
           };
       case "account/requestLoan":
           if(state.loan > 0 ) return state;
           // LATER
           return {
               ...state,
               loan: action.payload.amount,
               loanpurpose: action.payload.purpose,
               balance: state.balance + action.payload.amount,
           };
       case "account/payLoan":
           return {
               ...state,
               loan: 0,
               loanpurpose: "",
               balance: state.balance - state.loan,
           };
        case "account/convertingCurrency":
            return{
                ...state,
                isLoading: true,
            }
       default:
           return state;
    }

}

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

export function withdraw(amount){
    return {type: "account/withdraw", payload: amount}
}

export function requestLoan(amount, purpose){
    return {
        type: "account/requestLoan", 
        payload: {amount: amount, purpose: purpose}
    }
}

export function payLoan(){
    return {type: "account/payLoan"};
}