'use strict'

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Provider, connect } from 'react-redux';
import LoginPage from "./src/pages/Login.js"
import { SignedOut } from "./src/routers"
import { SignedIn } from "./src/routers"
import { isSignedIn } from "./src/actions/auth"
import { createRootNavigator } from "./src/routers"
import { store } from "./src/store"

export default class reactmori extends Component {
  state = {
    signedIn: false,
    checkedSignIn: false
  }

  /* Befor the component will mount, we check if use signed in or not */
  componentWillMount() {
    isSignedIn()
      .then(res => {
        if(res) {this.setState({signedIn: true, checkedSignIn: true})}
        else { this.setState({signedIn: false, checkedSignIn: true}) }
      })
      .catch(err => {
        if(err !== null) alert("Error occured on signed in!")
      })
  }

  render() {
    const { signedIn, checkedSignIn } = this.state

    /* If haven't check yet, dont render anything */
    if(!checkedSignIn) {
      return null
    }

    const Layout = createRootNavigator(signedIn)
    /* If user is Logged in then render SignedIn logic, otherwise render SignedOut logic */
    return (
      <Provider store={store}>
        <Layout />
      </Provider>  
    )
  }
}

AppRegistry.registerComponent('reactmori', () => reactmori);
