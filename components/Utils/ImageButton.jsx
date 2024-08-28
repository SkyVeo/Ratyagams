import { useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ImageBackground,
} from "react-native";

const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
    },
});

/**
 * Displays a button with an image in the background
 *
 * @param {object} props The props object
 * @param {string} props.source The source of the image
 * @param {function} props.onPress The function to call when the button is pressed
 * @param {string} props.text The text to display on the button
 * @param {object} props.style The style of the button
 * @param {number} props.borderRadius The border radius of the button
 * @param {boolean} props.displayOverlay Whether to display the overlay or not
 *
 * @returns {JSX.Element} The button
 */
export default function ImageButton({
    source,
    onPress,
    text,
    style,
    borderRadius,
    displayOverlay,
}) {
    const [isActive, setIsActive] = useState(displayOverlay);

    return (
        <TouchableOpacity
            onPress={() => {
                setIsActive(!isActive);
                onPress();
            }}
        >
            <ImageBackground
                source={source}
                style={style}
                imageStyle={{ borderRadius: borderRadius }}
            >
                <View
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: isActive
                            ? "rgba(89, 165, 44, 0.7)"
                            : "rgba(0, 0, 0, 0.3)",
                        borderRadius: borderRadius,
                    }}
                />
                <Text
                    style={[
                        styles.text,
                        {
                            color: isActive ? "black" : "white",
                        },
                    ]}
                >
                    {text}
                </Text>
            </ImageBackground>
        </TouchableOpacity>
    );
}
