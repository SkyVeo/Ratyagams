import logo from "../../images/logo.png";
import { Input, Button, Text } from "@rneui/themed";
import { useState } from "react";
import { Image, View, StyleSheet, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
    faLock,
    faUser,
    faEye,
    faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { globalStyles } from "../../styles/globalStyles";
import { connection } from "../../APIAccess/user";
import { isValidEmail, isValidUsername } from "../../tools/utils";
import { useDispatch } from "react-redux";
import { addToken } from "../../store/slice/token";

const styles = StyleSheet.create({
    tinyLogo: {
        width: 100,
        height: 100,
        top: 50,
        marginBottom: 100,
    },
    form: {
        backgroundColor: "#59A52C",
        borderRadius: 20,
        padding: 10,
        width: 300,
    },
});

/**
 * Sign in page
 *
 * @param {object} props
 * @param {any} props.navigation navigation object
 * @param {object} props.route route params
 * @param {boolean} props.route.params.disconnect if the user has been disconnected
 *
 * @returns {JSX.Element}
 */
function SignIn({ route, navigation }) {
    const dispatch = useDispatch();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorPassword, setErrorPassword] = useState("");
    const [erroridentifiant, setErrorIdentifiant] = useState("");

    /**
     * Toggle the password visibility
     *
     * @returns {void}
     */
    function toggleShowPassword() {
        setShowPassword(!showPassword);
    }

    /**
     * Clean the error message
     *
     * @returns {void}
     */
    function cleanError() {
        setErrorIdentifiant("");
        setErrorPassword("");
    }

    /**
     * Clean the form
     *
     * @returns {void}
     */
    function cleanForm() {
        setLogin(undefined);
        setPassword(undefined);
        cleanError();
    }

    /**
     * Sign in the user with his given credentials
     *
     * @returns {void}
     */
    function signIn() {
        if (login && (isValidUsername(login) || isValidEmail(login))) {
            connection({ login, password })
                .then((token) => {
                    dispatch(addToken(`Bearer ${token}`));
                    cleanForm();
                    navigation.navigate("LoadingPage");
                })
                .catch((err) => {
                    err.response?.status === 401
                        ? setErrorPassword("Wrong username/email or password")
                        : setErrorPassword("An error occured");
                });
        } else {
            setErrorIdentifiant("Please enter a valid email or username");
        }
    }

    return (
        <View style={globalStyles.background}>
            <Image style={styles.tinyLogo} source={logo} />
            {route.params?.message && (
                <Text style={[globalStyles.error, { fontSize: 15 }]}>
                    {route.params.message}
                </Text>
            )}
            <View style={styles.form}>
                <Text style={globalStyles.textForm}>Identifiant</Text>
                <Input
                    style={globalStyles.inputLabel}
                    inputContainerStyle={globalStyles.inputContainer}
                    errorStyle={globalStyles.error}
                    placeholder="Username or email"
                    value={login}
                    onChangeText={(login) => setLogin(login)}
                    leftIcon={<FontAwesomeIcon icon={faUser} size={24} />}
                    errorMessage={erroridentifiant}
                />
                <Text style={globalStyles.textForm}>Password</Text>
                <Input
                    style={globalStyles.inputLabel}
                    inputContainerStyle={globalStyles.inputContainer}
                    errorStyle={globalStyles.error}
                    placeholder="Password"
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                    leftIcon={<FontAwesomeIcon icon={faLock} size={24} />}
                    rightIcon={
                        <Pressable onPress={toggleShowPassword}>
                            <FontAwesomeIcon
                                icon={showPassword ? faEye : faEyeSlash}
                                size={24}
                            />
                        </Pressable>
                    }
                    secureTextEntry={!showPassword}
                    errorMessage={errorPassword}
                />
            </View>
            <Button
                title="Sign In"
                titleStyle={{ fontWeight: "700" }}
                buttonStyle={{
                    backgroundColor: "#59A52C",
                    borderWidth: 0,
                    borderRadius: 20,
                }}
                containerStyle={{
                    width: 200,
                    marginHorizontal: 50,
                    marginVertical: 10,
                    paddingTop: 100,
                }}
                onPress={() => {
                    cleanError();
                    signIn();
                }}
            />
            <Button
                title="Create a account"
                titleStyle={{ fontWeight: "700" }}
                buttonStyle={{
                    backgroundColor: "#0000",
                    borderWidth: 0,
                    borderRadius: 20,
                }}
                containerStyle={{
                    width: 200,
                    marginHorizontal: 50,
                    marginVertical: 10,
                }}
                onPress={() => {
                    cleanForm();
                    navigation.navigate("SignUp");
                }}
            />
        </View>
    );
}

export default SignIn;
