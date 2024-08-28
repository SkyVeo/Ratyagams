import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { DARK_GREY, GREEN, LIGHT_GREY } from "../../tools/constants";
import { SelectCountry } from "react-native-element-dropdown";
import ErrorText from "./ErrorText";

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: "white",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    container: {
        backgroundColor: LIGHT_GREY,
        borderWidth: 0,
    },
    text: {
        color: "white",
        fontWeight: "bold",
    },
    image: {
        width: 24,
        height: 24,
        resizeMode: "contain",
        marginRight: 7,
    },
});

/**
 * Displays a dropdown list
 *
 * @param {object} props The props object
 * @param {object[]} props.data The data to display (key: label, value, image)
 * @param {string} props.selectedValue The selected value
 * @param {function} props.onChange The function to call when the value changes
 *
 * @returns {JSX.Element} The dropdown list
 */
export default function DropdownList({ data, selectedValue, onChange }) {
    const [value, setValue] = useState(selectedValue);
    const [isFocus, setIsFocus] = useState(false);

    return data.length === 0 ? (
        <ErrorText errorMessage="It seems that there is no data to display" />
    ) : (
        <View style={{ backgroundColor: DARK_GREY }}>
            <SelectCountry
                style={[styles.dropdown, isFocus && { borderColor: GREEN }]}
                selectedTextStyle={styles.text}
                imageStyle={styles.image}
                itemTextStyle={styles.text}
                containerStyle={styles.container}
                activeColor={GREEN}
                data={data}
                maxHeight={280}
                labelField="label"
                valueField="value"
                imageField="image"
                value={value}
                autoScroll={false}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                    onChange(item.value);
                    setValue(item.value);
                }}
            />
        </View>
    );
}
