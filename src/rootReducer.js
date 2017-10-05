import { combineReducers } from "redux"
import user from "./reducers/user"
import data from "./reducers/data"

export default rootReducer = combineReducers({
    /* Reducer is a function that take state and return new state  */
    user,
    data
})