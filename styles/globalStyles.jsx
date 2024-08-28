import { StyleSheet } from "react-native";
import { DARK_GREY } from "../tools/constants";

export const globalStyles = StyleSheet.create({

    centered: {
        alignSelf: "center",
        justifyContent: "center"
    },
    container: {
        padding: 20,
    },
    containerInsideView: {
        paddingTop: 20,
        width: "100%",
        alignSelf: "center",
        justifyContent: "center",
        flexDirection:'row'
    },
    background : {
        backgroundColor: DARK_GREY,
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center"
    },
    button : {
        backgroundColor : "#fff",
        borderRadius: 10,
        padding: 10,
    },
    inputContainer : {
        paddingLeft: 16,
        paddingRight: 16,
        borderColor:'transparent',
        backgroundColor:'#fff',
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    textForm : {
        paddingTop: 12,
        paddingLeft: 16,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    button : {
        backgroundColor: '#59A52C',
        borderWidth: 0,
        borderRadius: 20,
    },
    tinyLogo: {
        width: 50,
        height: 50,
        alignSelf: "center",
        marginTop: 25
    },
    error : {
        color : '#cc0000',
        fontSize : 12,
        fontWeight : 'bold',
    },
    greenText: {
        color : "#59A52C"
    },
    whiteText: {
        color: "#fff"
    },
    modifyButtonContainer: {
        width: 200,
        alignSelf: "center",
        marginBottom: 50,
        marginTop: 15,
        color: "#59A52C"
    },
    headerBackgroundColor: {
        backgroundColor: "#443D3D",
    },
    containerBorderColor: {
        borderColor: "#443D3D",
    }
});
