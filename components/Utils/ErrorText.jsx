import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    inner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorTitle: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "grey",
        fontSize: 15,
        fontWeight: "bold",
    },
});

/**
 * Displays an error message
 * 
 * @param {object} props The props object
 * @param {string} props.errorMessage The error message to display
 * 
 * @returns {JSX.Element} The error message
 */
export default function ErrorText({ errorMessage }) {
    return (
        <View style={styles.inner}>
            <Text style={styles.errorTitle}>Whoops...</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
    );
}
