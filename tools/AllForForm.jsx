import { Input, Button, Text } from "@rneui/themed";
import { globalStyles } from "../styles/globalStyles";

function InputWithLabel({
    inputStyle = null,
    label = null,
    labelStyle = null,
    inputContainerStyle = null,
    placeholder = null,
    value = null,
    onChangeText = null,
    leftIcon = null,
    rightIcon = null,
    secureTextEntry = null,
    errorProps = null,
    onChange = null,
    errorMessage = null,
    errorStyle = null,
    autoCapitalize = null,
    keyboardType = null,
}) {
    return (
        <>
            <Text style={labelStyle ? labelStyle : globalStyles.textForm}>
                {label}
            </Text>
            <Input
                inputStyle={inputStyle ? inputStyle : globalStyles.inputLabel}
                inputContainerStyle={
                    inputContainerStyle
                        ? inputContainerStyle
                        : globalStyles.inputContainer
                }
                errorStyle={errorStyle ? errorStyle : globalStyles.error}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                secureTextEntry={secureTextEntry}
                errorProps={errorProps}
                onChange={onChange}
                errorMessage={errorMessage}
                autoCapitalize={autoCapitalize ? autoCapitalize : "sentences"}
                keyboardType={keyboardType ? keyboardType : "default"}
            />
        </>
    );
}

function ValidateButton({
    title,
    titleStyle = null,
    buttonStyle = null,
    containerStyle = null,
    onPress,
}) {
    return (
        <Button
            title={title}
            titleStyle={titleStyle ? titleStyle : { fontWeight: "700" }}
            buttonStyle={
                buttonStyle
                    ? buttonStyle
                    : {
                          backgroundColor: "#59A52C",
                          borderWidth: 0,
                          borderRadius: 20,
                      }
            }
            containerStyle={
                containerStyle
                    ? containerStyle
                    : {
                          width: 200,
                          marginHorizontal: 50,
                          marginVertical: 10,
                          paddingTop: 100,
                      }
            }
            onPress={onPress}
        />
    );
}

export { InputWithLabel, ValidateButton };
