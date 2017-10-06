import React, { Component } from 'react'
import PropTypes from "prop-types"
import init from 'react_native_mqtt';
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
init({
    size: 10000000000000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync : {
    }
});

function onConnect() {
    console.log("*********** onConnect ****************");
    client.subscribe("#")
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

function onMessageArrived(message) {
    var data = message.payloadString
    console.log("onMessageArrived: " + data);
    /* Dispatch data to update UI */
    gotSinpakuKokyuuData(data)
}

var client = new Paho.MQTT.Client('192.168.1.111', 9001, 'unique_client_name');
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({onSuccess: onConnect});

/* --------------------- End MQTT --------------------------- */
var setIntervalId
class HomePage extends Component {
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
                        <Text>ニコニコ指数</Text>
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
        backgroundColor: "#C5EFF7",
        flex: 1,
        flexDirection: "column",
        padding: 5
    },
    header: {
        flex:1,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-around",
        marginBottom: 15,
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
        width: 200,
        height: 250
    },
    title: { 
        fontSize:24, 
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