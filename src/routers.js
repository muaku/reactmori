import { StackNavigator } from "react-navigation";

import Login from "./pages/Login"
import Home from "./pages/Home"

/* Navigator is just a component */
/* SignedOut logic */
export const SignedOut = StackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            title: "Sign In"
        }
    }
}, 
{
        headerMode: "none"
})

/* SignedIn logic */
export const SignedIn = StackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            // title: "Home"
        }
    }, 
}, 
{
        headerMode: "none"
})

/* Root navigation */
export const createRootNavigator = (signedIn = false) => {
    return StackNavigator({
        SignedIn: {
            screen: SignedIn,
            navigationOptions:{
                gesturesEnabled: false
            }
        },
        SignedOut: {
            screen: SignedOut,
            navigationOptions:{
                gesturesEnabled: false
            }
        }  
    },
    {
        headerMode: "none",
        mode: "modal",
        initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
)
}