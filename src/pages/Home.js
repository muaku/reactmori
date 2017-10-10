import React, { Component } from 'react'
import PropTypes from "prop-types"
import { Client, Message } from 'react-native-paho-mqtt';
import { AsyncStorage } from 'react-native';
import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableHighlight,
  View,
  Image
} from 'react-native';
import { connect } from "react-redux"
import * as _ from "lodash"

import { SinpakuCard, KokyuuCard} from "../cards/ItemCard"
import { gotSinpakuKokyuuData } from "../actions/data"

/* ------------------ Start MQTT --------------------- */
//Set up an in-memory alternative to global localStorage 
const myStorage = {
  setItem: (key, item) => {
    myStorage[key] = item;
  },
  getItem: (key) => myStorage[key],
  removeItem: (key) => {
    delete myStorage[key];
  },
};

// Create a client instance 
const client = new Client({ uri: 'ws://192.168.1.111:9001/ws', clientId: 'clientId', storage: myStorage });

// set event handlers 
client.on('connectionLost', (responseObject) => {
  if (responseObject.errorCode !== 0) {
    console.log(responseObject.errorMessage);
  }
});
client.on('messageReceived', (message) => {
    var data = message.payloadString
    console.log("onMessageArrived: " + data);
    /* Dispatch data to update UI */
    gotSinpakuKokyuuData(data)
});
 
// connect the client 
client.connect()
  .then(() => {
    // Once a connection has been made, make a subscription and send a message. 
    console.log("*********** onConnect ****************");
    return client.subscribe("#");
  })
  .catch((responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  })

/* --------------------- End MQTT --------------------------- */
var setIntervalId
class HomePage extends Component {
    // setup tabar options
    static navigationOptions = {
        tabBarLabel: "Home",
        title: "Home",
        headerStyle: {
            backgroundColor: "#52B3D9"
        }
    }

    // Define state
    state = {
        smileBgColor: ["#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff"]
    }

    /* Call when 表情データ comes */
    updateSmileBgColor(toIndex) {       /* toIndex: 0-9 (0%:noIndex,10%:0Index) */
        let color = "#ff75aa"
        let smileBgColor = ["#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff"]
        for(let i = 0; i<= toIndex; i++) {
            smileBgColor[i] = color
        }
        this.setState({
            smileBgColor: smileBgColor
        })

    }

    /* Generate random data for smile Item */
    testSmileBgColor() {
        return setInterval(() => {
            var index = Math.floor((Math.random() * 10))    /* Return a number btw 0-9 */
            this.updateSmileBgColor(index)
        }, 3000)
    }

    componentDidMount() {
        console.log("HOME MOUNTED")
        setIntervalId = this.testSmileBgColor()
    }

    /* When component will unmounted, then clear the setInterval */
    componentWillUnmount(){
        /* We hv to clear this setInterval to prevent calling setState on unmounted component */
        clearInterval(setIntervalId)
    }

    render () {
        /* TODO: Observe 表情データ & convert 表情データ to 0-9 (0%:noUpdate, 10%:0index,20%:1index) */

        /* To prevent when no data yet BUG */
        if(!_.isEmpty(this.props.data)){
            console.log("NOTEMPTY")
            var { heart, breath } = JSON.parse(this.props.data)
        }else{
            console.log("EMPTY")
            var { heart, breath } = {heart:0,breath:0}
        }
         
        return (
            <View style={styles.container}>
                <View style={styles.header} >
                    <View style={styles.imageContainer} >
                        <Image style={styles.profileImage} source={require("../images/icon.png")} resizeMode="cover" />
                    </View>
                     <View style={styles.percentItemView} >
                        <Text style={{ color: "#446CB3"}} >ニコニコ指数</Text>
                        <View style={[styles.percentItem,{backgroundColor: this.state.smileBgColor[9]}]}><Text style={{ flex:1, textAlign:"center"}} >100%</Text></View>
                        <View style={[styles.percentItem,{backgroundColor: this.state.smileBgColor[8]}]}><Text style={{ flex:1, textAlign:"center"}} >90%</Text></View>
                        <View style={[styles.percentItem,{backgroundColor: this.state.smileBgColor[7]}]}><Text style={{ flex:1, textAlign:"center"}} >80%</Text></View>
                        <View style={[styles.percentItem,{backgroundColor: this.state.smileBgColor[6]}]}><Text style={{ flex:1, textAlign:"center"}} >70%</Text></View>
                        <View style={[styles.percentItem,{backgroundColor: this.state.smileBgColor[5]}]}><Text style={{ flex:1, textAlign:"center"}} >60%</Text></View>
                        <View style={[styles.percentItem,{backgroundColor: this.state.smileBgColor[4]}]}><Text style={{ flex:1, textAlign:"center"}} >50%</Text></View>
                        <View style={[styles.percentItem,{backgroundColor: this.state.smileBgColor[3]}]}><Text style={{ flex:1, textAlign:"center"}} >40%</Text></View>
                        <View style={[styles.percentItem,{backgroundColor: this.state.smileBgColor[2]}]}><Text style={{ flex:1, textAlign:"center"}} >30%</Text></View>
                        <View style={[styles.percentItem,{backgroundColor: this.state.smileBgColor[1]}]}><Text style={{ flex:1, textAlign:"center"}} >20%</Text></View>
                        <View style={[styles.percentItem,{backgroundColor: this.state.smileBgColor[0]}]}><Text style={{ flex:1, textAlign:"center"}} >10%</Text></View>
                    </View>
                </View>
                <Text style={styles.title} >今日の尾崎さんのヘルスデータ</Text>
                <View style={styles.cardContainer}>
                    <SinpakuCard imageName="sinpaku.jpg" value={heart} /> 
                    <KokyuuCard imageName="kokyuu.png" value={breath} /> 
                </View>
            </View>
            
        )
    }
}

// HomePage.propTypes = {

// }

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ECECEC",
        flex: 1,
        flexDirection: "column",
        paddingTop: 20,
    },
    header: {
        flex:1,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-around",
        marginTop: 10,
        marginBottom: 20,
        paddingLeft: 10
    },
    percentItemView: {
        flex:1,
        flexDirection: "column",
        alignItems: "center"
    },
    percentItem: {
        width: 80,
        height: 20,
        borderColor: "#ff75aa",
        borderWidth: 1
        
    },
    color: {
        backgroundColor: "#ff75aa"
    },
    imageContainer: {
        alignItems: "center",
        borderColor: "#ff75aa",
        borderWidth: 5
    },
    profileImage: {
        width: 180,
        height: 220
    },
    title: { 
        fontSize:24, 
        color: "#446CB3",
        fontWeight: "bold",
        textAlign: "center"
    },
    cardContainer: {
        flex: 1,
        flexDirection: "row"
        // justifyContent: "space-around"
        // flexWrap: "wrap"
        // alignItems: "stretch"        /* Center horizontal */
    }
})

/* Connect this component to redux */
function mapStateToProp(state) {
    return {
        data: state.data
    }
}

export default connect(mapStateToProp)(HomePage)