import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableHighlight,
  View,
  Image,
  KeyboardAvoidingView
} from 'react-native';

class Setting extends Component {
    // Setup tabbar options
    static navigationOptions = {
        tabBarLabel: "Setting",
        title: "Setting",
        headerStyle: {
            backgroundColor: "#52B3D9"
        }
    }

    onShutdown_Press() {
        console.log("シャットダウン要求")
    }

    onRestart_Press() {
        console.log("再起動要求")
    }

    render () {
        return (
            <View style={styles.container} >
                <TouchableHighlight onPress={() => this.onRestart_Press()} underlayColor={"#C5EFF7"} style={[styles.button, styles.restart_bgColor]}>
                    <Text style={styles.buttonText}>再起動</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.onShutdown_Press()} underlayColor={"#C5EFF7"} style={[styles.button, styles.shutdown_bgColor]}>
                    <Text style={styles.buttonText}>シャットダウン</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

// Setting.propTypes = {

// }

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ECECEC",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 5
    },
     button: {
        padding:20,
        backgroundColor: '#34A853',
        alignItems: "center",
        margin: 20,
        width: 200,
        borderRadius: 5
    },
    restart_bgColor: {
        backgroundColor: "#F4D03F"
    },
    shutdown_bgColor: {
        backgroundColor: "#EF4836"
    },
    buttonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold"
    }
})

export default Setting