import React, { Component } from 'react'
import PropTypes from "prop-types"
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
        heart: 0,
        breath: 0,
        smileBgColor: ["#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff"]
    }

    /* Call when 表情データ comes */
    updateSmileBgColor(toIndex) {       /* toIndex: 0-9 (0%:noIndex,10%:0Index) */
        let color = "#ff75aa"
        let smileBgColor = ["#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff"]
        if(toIndex !== -1) {
            for(let i = 0; i<= toIndex; i++) {
                smileBgColor[i] = color
            }
        }
        this.setState({
            smileBgColor: smileBgColor
        })

    }

    /* Handle Smile element , joyEmoData: 0~100 → 0~9*/
    _handleSmileElement(joyEmoData) {
        console.log("joyEmoData: ", joyEmoData)
        var joyEmoNormalize 
        if(joyEmoData<5) {
            joyEmoNormalize = -1    // Render nothing
        }else if(joyEmoData>=5 && joyEmoData<15) {
            joyEmoNormalize = 0
        }
        else if(joyEmoData>=15 && joyEmoData<25) {
            joyEmoNormalize = 1
        }
        else if(joyEmoData>=25 && joyEmoData<35) {
            joyEmoNormalize = 2
        }
        else if(joyEmoData>=35 && joyEmoData<45) {
            joyEmoNormalize = 3
        }
        else if(joyEmoData>=45 && joyEmoData<55) {
            joyEmoNormalize = 4
        }
        else if(joyEmoData>=55 && joyEmoData<65) {
            joyEmoNormalize = 5
        }
        else if(joyEmoData>=65 && joyEmoData<75) {
            joyEmoNormalize = 6
        }
        else if(joyEmoData>=75 && joyEmoData<85) {
            joyEmoNormalize = 7
        }
        else if(joyEmoData>=85 && joyEmoData<95) {
            joyEmoNormalize = 8
        }
        else if(joyEmoData>95) {
            joyEmoNormalize = 9
        }
        console.log("joyEmoNormalize: ", joyEmoNormalize)
        this.updateSmileBgColor(joyEmoNormalize)
        
    }

    componentDidMount() {
        console.log("HOME MOUNTED")
    }

    /* When component will unmounted, then clear the setInterval */
    componentWillUnmount(){
        console.log("HOME WILL UNMOUNTED")
    }
    
    /* Handle render data */
    componentWillReceiveProps(nextProps) {
        if(!_.isEmpty(this.props.data) && !_.isEmpty(nextProps.data)) {
            console.log("NEXT PROPS: ", nextProps.data)
            var nextData = JSON.parse(nextProps.data)
            var preData = JSON.parse(this.props.data)
            console.log("WillReceiveProps data: ", nextData)
            var { joy, heart, breath } = (nextData)
            if(joy) {
                console.log("joy: ", joy)
                this._handleSmileElement(parseInt(joy))
                this.setState({
                    heart: preData.heart,
                    breath: preData.breath
                })
            }
            if(heart || breath) {
                this.setState({
                    heart: heart,
                    breath: breath
                })
            }
            
        }   
    }

    // componentDidMount() {
    //     //TODO: MOVE Paho client here

    // }

    render () {
        /* TODO: Observe 表情データ & convert 表情データ to 0-9 (0%:noUpdate, 10%:0index,20%:1index) */

        /* To prevent when no data yet BUG */
        if(!_.isEmpty(this.props.data)){
            console.log("NOTEMPTY")
            var { heart, breath } = this.state
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
                <Text style={styles.title} >今日のあなたのヘルスデータ</Text>
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
        justifyContent: "flex-start",
        padding: 5,
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
        // flexGrow:1,
        flexDirection: "column",
        alignItems: "flex-start"
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
        // flexGrow:2,
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