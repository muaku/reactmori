import { StackNavigator, TabNavigator } from "react-navigation";

import Login from "./pages/Login"
import Home from "./pages/Home"
import Setting from "./pages/Setting"

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

/* For TabNavigator view */
const RootTab = TabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            // title: "Home"
        }
    },
    Setting: {
        screen: Setting
    } 
}, 
{
        // headerMode: "none",
        tabBarPosition: "bottom",
        animationEnabled: true,
        tabBarOptions: {
            activeTintColor: "#D2527F",
            labelStyle: {
                fontSize: 18,
                color: "black",
                fontWeight: "bold",
            },
            style: {
                backgroundColor: "#ECF0F1"
            },
            indicatorStyle: {
                backgroundColor: "#19B5FE"
            }
        }
})

/* SignedIn logic, (asign both tabbar and navbar) */
export const SignedIn = StackNavigator({
    RootTab: {
        screen: RootTab
    }
},{
    headerMode: "screen"
})






/* Root navigation */
export const createRootNavigator = (signedIn = false) => {
    return StackNavigator({
        SignedIn: {
            // screen: SignedIn,
            screen: RootTab,
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