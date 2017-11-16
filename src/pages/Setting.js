import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableHighlight,
  View,
  Image,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import base64 from 'base64-js';
import dgram from 'dgram';
import { NetworkInfo } from 'react-native-network-info'
import * as _ from "lodash"

import { Client, Message } from 'react-native-paho-mqtt';
import { AsyncStorage } from 'react-native';

import { gotFaceData, gotSinpakuKokyuuData, reportMqttConnection } from "../actions/data"

// const HOST_IP = ""
const PORT = 9001
var IP = ""
var mqtt_client
var setTimeoutIdConnectionStatus
// only works for 8-bit chars
function toByteArray(obj) {
  var uint = new Uint8Array(obj.length);
  for (var i = 0, l = obj.length; i < l; i++){
    uint[i] = obj.charCodeAt(i);
  }

  return new Uint8Array(uint);
}

class Setting extends Component {

    state = {
        ipList: [{
            robot_ip: "",
            hostname: ""
        }],
        udp_client : dgram.createSocket("udp4"),
        mqtt_client: () => {}
    }
    
    // Setup tabbar options
    static navigationOptions = {
        tabBarLabel: "Setting",
        title: "Setting",
        headerStyle: {
            backgroundColor: "#52B3D9"
        }
    }

    componentDidMount() {
        console.log("SETTING MOUNTED")
        this.robot_ip_search()
        // if(!_.isEmpty(HOST_IP)) {

        // }
    }

    componentWillUnmount() {
        console.log("SETTING WILL UNMOUNTED")
        let { udp_client } = this.state
        udp_client.close()
    }

    /* ip Searching */
    robot_ip_search() {
        let { udp_client } = this.state
        IP = ""
        var tempIpList = []

        // get ip addr before connecting
        // GET ip address
        NetworkInfo.getIPV4Address(ipv4 => {
            if(_.isEmpty(ipv4)) {
                console.log("Not connected to network")
                Alert.alert("ネットワークエラー", "ネットワークに接続されていない")
                this.setState({
                    ipList: [{
                        robot_ip: "",
                        hostname: ""
                    }]
                })
            } else {
                IP = ipv4
                console.log("IP: ", IP)
                
                // UDP
                let UDP_PORT = 7000
                const REQ_DATA = "IP_REQ"
                //let udp_client = dgram.createSocket("udp4")
                udp_client.bind(UDP_PORT, () => {
                    udp_client.setBroadcast(true)
                })
                // get broadcast ip address
                var getBroadcast_IP = (myIP) => {
                    var ipArray = myIP.split(".")
                    return ipArray[0] + "." + ipArray[1]+ "." + ipArray[2]+ "." +"255"
                }
                const BROADCAST_IP = getBroadcast_IP(IP)
                console.log("BROADCAST_IP: ", BROADCAST_IP)

                
                udp_client.on("error", (err) => {
                    console.log("udp_client error: ", err)
                    udp_client.close()
                })
                
                udp_client.once('listening', function() {
                    var msgAsBuff = toByteArray(REQ_DATA)
                    udp_client.send(msgAsBuff, 0, msgAsBuff.length, UDP_PORT, BROADCAST_IP)
                    
                })
                udp_client.on("message", (message, addrInfo) => {
                    var str_message = String.fromCharCode.apply(null, new Uint8Array(message))
                    console.log("message: ", str_message)
                    if(str_message.indexOf("SERVER_HOSTNAME") != -1) {
                        var listObj = {
                            robot_ip: addrInfo.address,
                            hostname: str_message.split(":")[1]
                        }
                        // receive only other IP addr
                        if(listObj.robot_ip != IP) {
                            tempIpList.push(listObj)
                            this.setState({
                                ipList: tempIpList
                            })
                            console.log("ipList: ", this.state.ipList)
                        }
                        
                    }
                })
            }
        }) 
    }

    /* connect button */
    mqtt_conn_Press(ip) {
        HOST_IP = ip
        this.initMQTT(ip)
    }

    /* ------------------ Start MQTT --------------------- */
    //Set up an in-memory alternative to global localStorage 
    initMQTT(hostIP) {
        /* Disconnect the old one before establish new connection */
        if(!_.isEmpty(mqtt_client)) {
            mqtt_client.disconnect()
        }

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
        mqtt_client =  new Client({ uri: `ws://${hostIP}:${PORT}/ws`, clientId: 'mk' + (Math.random()*100).toString(), storage: myStorage })
        // set event handlers 
        mqtt_client.on('connectionLost', (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log(responseObject.errorMessage);
        }
        });
        mqtt_client.on('messageReceived', (message) => {
            var topic = message.destinationName
            var data = message.payloadString
            console.log(topic)
            // console.log("onMessageArrived: " + data);
            if(topic == "microsensor/data") {
                
                // /* 接続状態の確認 */
                // if(!_.isEmpty(setTimeoutIdConnectionStatus)) {
                //     clearTimeout(setTimeoutIdConnectionStatus)
                // }
                // reportMqttConnection({status: true})
                // setTimeoutIdConnectionStatus = setTimeout(() => {  /* 30秒経過してもデータがこない場合は、不接続状態に報告する */
                //     reportMqttConnection({status: false})
                // }, 30000)

                /* Dispatch data to update sinpaku kokyuu UI */
                console.log("on micro MessageArrived: " + data);
                gotSinpakuKokyuuData(data)
            }else if(topic.indexOf("camera") !== -1 ) {   // room/001/robo/001/camera
                console.log("on camera MessageArrived: " + data);
                /* Dispatch data to update 笑顔 UI */
                gotFaceData(data)
            }  
        })
        // connect the client 
        mqtt_client.connect()
        .then(() => {
            // Once a connection has been made, make a subscription and send a message. 
            console.log("*********** onConnect ****************");
            return mqtt_client.subscribe("#");
        })
        .catch((responseObject) => {
            if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost:' + responseObject.errorMessage);
            }
        })

    }
    /* --------------------- End MQTT --------------------------- */

    onRobotSearch_Press() {
        let { udp_client } = this.state
        if(udp_client){
            udp_client.close()
            this.setState({
                udp_client: dgram.createSocket("udp4")
            }, () => {
                this.robot_ip_search()
            })
        }
    }

    onShutdown_Press() {
        console.log("シャットダウン要求")
    }

    onRestart_Press() {
        console.log("再起動要求")
    }

    render () {
        const { ipList } = this.state
        return (
            <View style={styles.container} >
                {ipList && ipList.map((my_iplist, index) => {
                    let { robot_ip, hostname } = my_iplist
                    return _.isEmpty(robot_ip) ? null : (
                        <View key={index} style={{ flex:1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}} >
                            <Text>{hostname}</Text>
                            <TouchableHighlight onPress={() => this.mqtt_conn_Press(robot_ip)} underlayColor={"#C5EFF7"} style={styles.mqtt_conn_button}>
                                <Text style={{ fontSize: 14 }}>接続</Text>
                            </TouchableHighlight>
                        </View>
                    )    
                })}
                <TouchableHighlight onPress={() => this.onRobotSearch_Press()} underlayColor={"#C5EFF7"} style={[styles.button, styles.robotSearch_bgColor]}>
                    <Text style={styles.buttonText}>Refresh</Text>
                </TouchableHighlight>
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
    mqtt_conn_button: {
        padding: 3,
        backgroundColor: "green",
        alignItems: "center",
        width: 60,
        height: 30,
        borderRadius: 3
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
    robotSearch_bgColor: {
        backgroundColor: "green"
    },
    buttonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold"
    }
})

export default Setting