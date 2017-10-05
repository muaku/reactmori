import React from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableHighlight,
  View,
  Image
} from 'react-native';

// const ItemCard = ({ imageName, value }) => {
//     return (
//         <View style={styles.card}>
//             {/* require("../images/" + imageName) が使えないため */}
//             <Image style={styles.cardImage} source={require("../images/" + imageName)} /> 
//             <Text style={styles.cardValue}>{value}</Text> 
//         </View>
//     )
// }

export const SinpakuCard = ({ imageName, value }) => {
    return (
        <View style={styles.card}>
            {/* require("../images/" + imageName) が使えないため */}
            <Image style={styles.cardImage} source={require("../images/sinpaku.jpg")} /> 
            <Text style={styles.cardValue}>{value}</Text> 
        </View>
    )
}

export const KokyuuCard = ({ imageName, value }) => {
    return (
        <View style={styles.card}>
            {/* require("../images/" + imageName) が使えないため */}
            <Image style={styles.cardImage} source={require("../images/kokyuu.png")} /> 
            <Text style={styles.cardValue}>{value}</Text> 
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flex:1,
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-between",
        borderStyle: "solid",
        borderColor: "#2C3E50",
        borderWidth: 3,
        borderRadius: 5,
        padding: 10,
        backgroundColor: "#ffdd8e",
        width:160,
        height:120,
        margin: 2,
        shadowColor: "#000000",
        shadowOffset: {
            width: 1,
            height:3
        },
        shadowRadius: 3,
        shadowOpacity: 1.0
    },
    cardImage: {
        width: 60,
        height: 60,
        zIndex: 5
    },
    cardValue: {
        flex:1,         /* make cardValue take all the left space */
        color: "black",
        fontSize: 38,
        fontWeight: "bold",
        textAlign: "center"
    }
})
