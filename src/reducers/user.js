import USER_LOGGED_IN from "../types"
import USER_LOGGED_OUT from "../types"
/* Reducer is a function that takes state and action, then return new state */
export default function user(state={}, action={}) {
    switch(action.type) {
        case USER_LOGGED_IN:
            /* SOMTHING ELSE TODO BEFOR RETURN */
            return action.user  /* New state to store in Store */
        case USER_LOGGED_OUT:
            /* SOMTHING ELSE TODO BEFOR RETURN */
            return {}  /* Nothing */
        default:
            return state
    }
}
