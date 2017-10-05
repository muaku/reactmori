'use strict'

import React, { Component } from 'react';
import PropTypes from "prop-types"
import * as _ from "lodash"
import validator from "validator"
import { StackNavigator } from "react-navigation";
import { connect } from "react-redux"
import { login } from "../actions/auth"
import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableHighlight,
  View,
  Image
} from 'react-native';

/* Label component */
const Label = (props) => {
    return (
        <Text style={styles.textLabel}>{props.text}</Text>  
    )
}

/* Button component */
/* stateless component (no state, no inner function ) */
const Button = (props) => {
    return(
        <TouchableHighlight onPress={() => props.onPress()} underlayColor={"#C5EFF7"} style={styles.button}>
            <Text style={styles.buttonText}>{props.text}</Text>
        </TouchableHighlight>
    )
}

/* Login page */
/* statefull component, (has state, has inner function ) */
class LoginPage extends Component {
    /* Define a state, the has basic properties (data, loading, errors) */
    state = {
        data: {
            email: "",
            password: ""
        },
        loading: false,
        errors: {}
    }
    /* Login function */
    _press = () => {
        this.props.navigation.navigate("SignedIn")

        // // Check if no errors, then excute login function
        // const errors = this.validate(this.state.data)
        // this.setState({...this.state.errors, errors})   // Update errors in state
        // if(_.isEmpty(errors)) {
        //     console.log("DATA: ", this.state.data)
        //     //this.props.navigation.navigate("SignedIn")
        //     // Excute Login action (From redux), if success GOTO HOME
        //     this.props.login(this.state.data)
        //         .then(() => this.props.navigation.navigate("SignedIn"))
        //         .catch(err => {
        //             console.log("SOMETHING WENT WRONG ONLOGIN")
        //             console.log(err)
        //         })
        // }
    }

    /* Validate func: takes input data and return errors */
    validate(data) {
        const errors = {}
        if(!validator.isEmail(data.email)) errors.email = "正しいメールを入力ください!"
        if(_.isEmpty(data.password)) errors.password = "パスワードは空にするのができない！"
        return errors
    }

    /* takes an event, and return new state */
    _onEmailChange = text => {this.setState({
        data: {...this.state.data, "email": text}
    })}

    _onPasswordChange = text => {this.setState({
        data: {...this.state.data, "password": text}
    })}

    render() {
        // destructurize

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            見守りCAREロボット
                        </Text>
                    </View>
                    <View>
                        <Image style={styles.icon} source={require("../images/icon.png")} resizeMode="cover" /> 
                    </View>
                    <View style={styles.content}>
                        <Label text="Email" />
                        <TextInput
                            style={styles.textInput}
                            name="email"
                            value={this.state.data.email}
                            onChangeText={this._onEmailChange}
                            placeholder="example@email.com"
                            />
                        {/* If there is an email error then,..  */}
                        {this.state.errors.email && <Text style={styles.errMsg}>{this.state.errors.email}</Text>}

                        <Label text="パスワード" />
                        <TextInput
                            secureTextEntry={true}
                            style={styles.textInput}
                            name="password"
                            value={this.state.data.password}
                            onChangeText={this._onPasswordChange}
                            placeholder="パスワード"
                            />
                        {this.state.errors.password && <Text style={styles.errMsg}>{this.state.errors.password}</Text>}

                        <Button onPress={this._press} text="Login" />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

/* Define prop types */
LoginPage.propTypes = {
    login: PropTypes.func.isRequired
}

/* Login pages style */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: "#C5EFF7"
    },
    scroll: {
        flexDirection: "column"
    },
    icon: {
        alignSelf: "center",
        width: 100,
        height:100,
        borderWidth:3,
        borderColor: "#eee",
        borderRadius:50
    },
    title: {
        fontSize: 28,
        textAlign: "center",
        fontWeight: "bold",
        marginTop: 20
    },
    content: {
        marginTop: 5
    },
    textLabel: {
        fontSize: 20,
        fontWeight: "bold",
        // marginBottom: 10,
        color: "#595856"
    },
    button: {
        padding:20,
        backgroundColor: '#34A853',
        alignItems: "center",
        marginTop: 20,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18
    },
    textInput: {
        height: 60,
        fontSize: 16
    },
    errMsg: {
        fontSize: 14,
        color: "red"
    }
})

/* Export LoginPage class with with a connection with redux */
export default connect(null, { login })(LoginPage)
