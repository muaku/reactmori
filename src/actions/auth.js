import { AsyncStorage } from "react-native" 
import util from "util"
import api from "../api"
import { USER_LOGGED_IN } from "../types"
import { USER_LOGGED_OUT } from "../types"

export const USER_KEY = "USER_KEY"

/* Normal redux action */
export const userLoggedIn = (user) => {
    type: USER_LOGGED_IN,   // type
    user                    // playload
}

/* Normal redux action */
export const userLoggedOut = () => {
    type: USER_LOGGED_OUT   // type
}

/* login function used in connect on LoginPage 
+  when user loggedIn then dispatch an action to make react rendered
+  When dispatched, then will be catched in reducer
*/
export const login =  (credential) => (dispatch) => 
    api.user.login(credential).then(user => {
            console.log("user: ", user)
            if(user !== null){
                console.log("user in auth: ", user)
                AsyncStorage.setItem(USER_KEY, user)
                dispatch(userLoggedIn(user))
            }
        })


/* Logout: remove USER_KEY from AsyncStorage and dispatch an action */
export const logout =  () => (dispatch) => {
    AsyncStorage.removeItem(USER_KEY)
    dispatch(userLoggedOut())
}

/* isSignedIn: If USER_KEY exist in AsyncStorage then means user is signedIn */
export const isSignedIn = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(USER_KEY)
            .then(res => {
                if(res !== null) resolve(true)
                else resolve(false)
            })
            .catch(err => {
                reject(err)
            })
    })
}