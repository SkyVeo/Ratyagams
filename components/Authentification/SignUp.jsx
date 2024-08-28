import {
    Image,
    View,
    StyleSheet,
    Pressable,
    ScrollView,
    SafeAreaView,
} from "react-native";
import { Input, Button, Text } from "@rneui/themed";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
    faLock,
    faUser,
    faEye,
    faEyeSlash,
    faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { globalStyles } from "../../styles/globalStyles";
import logo from "../../images/logo.png";
import { connection, postUser } from "../../APIAccess/user";
import { isValidForm } from "../../tools/isValidForm";
import { useDispatch } from "react-redux";
import { addToken } from "../../store/slice/token";

const styles = StyleSheet.create({
    tinyLogo: {
        top: 50,
        width: 100,
        height: 100,
        marginBottom: 100,
    },
    form: {
        backgroundColor: "#59A52C",
        borderRadius: 20,
        width: 300,
    },
    input: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
    },
});

/**
 * Sign up page
 *
 * @param {object} props
 * @param {any} props.navigation
 *
 * @returns {JSX.Element}
 */
function SignUp({ navigation }) {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        username: undefined,
        email: undefined,
        password: undefined,
        repeatPassword: undefined,
        firstname: undefined,
        lastname: undefined,
        errorFirstname: undefined,
        errorLastname: undefined,
        errorUsername: undefined,
        errorMail: undefined,
        errorPassword: undefined,
    });
    const [showPassword, setShowPassword] = useState(false);

    /**
     * Clean the form and the errors
     *
     * @returns {void}
     */
    function cleanForm() {
        setForm({
            ...form,
            username: undefined,
            email: undefined,
            password: undefined,
            repeatPassword: undefined,
            firstname: undefined,
            lastname: undefined,
        });
        displayError();
    }

    /**
     * Display the errors or clean them if there is no argument
     *
     * @param {string} errorUsername - The error of the username
     * @param {string} errorMail - The error of the email
     * @param {string} errorFirstname - The error of the firstname
     * @param {string} errorLastname - The error of the lastname
     * @param {string} errorPassword - The error of the password
     *
     * @returns {void}
     */
    function displayError(
        errorUsername,
        errorMail,
        errorFirstname,
        errorLastname,
        errorPassword
    ) {
        setForm({
            ...form,
            errorUsername: errorUsername,
            errorMail: errorMail,
            errorFirstname: errorFirstname,
            errorLastname: errorLastname,
            errorPassword: errorPassword,
        });
    }

    /**
     * Register the user
     *
     * @returns {void}
     */
    function register() {
        if (isValidForm(form, setForm)) {
            postUser(form)
                .then(() => {
                    connection({
                        login: form.username,
                        password: form.password,
                    }).then((token) => {
                        dispatch(addToken(`Bearer ${token}`));
                        cleanForm();
                        navigation.navigate("Home");
                    });
                })
                .catch((err) => {
                    if (
                        err.response?.data?.message.includes("username") ||
                        err.response?.data?.message.includes("email")
                    ) {
                        displayError(
                            "Username already taken",
                            "Email already taken"
                        );
                    } else {
                        displayError(
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            "An error occured"
                        );
                    }
                });
        }
    }

    /**
     * Toggle the password visibility
     *
     * @returns {void}
     */
    function toggleShowPassword() {
        setShowPassword(!showPassword);
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <SafeAreaView style={globalStyles.background}>
                <Image style={styles.tinyLogo} source={logo} />
                <View style={styles.form}>
                    <Text style={globalStyles.textForm}>First name</Text>
                    <Input
                        inputStyle={globalStyles.inputLabel}
                        inputContainerStyle={globalStyles.inputContainer}
                        placeholder="Firstname"
                        value={form.firstname}
                        onChangeText={(firstname) =>
                            setForm({
                                ...form,
                                firstname:
                                    firstname.length === 0 ? null : firstname,
                            })
                        }
                        leftIcon={<FontAwesomeIcon icon={faUser} size={24} />}
                        errorMessage={form.errorFirstname}
                        errorStyle={globalStyles.error}
                    />
                    <Text style={globalStyles.textForm}>Last name</Text>
                    <Input
                        inputStyle={globalStyles.inputLabel}
                        inputContainerStyle={globalStyles.inputContainer}
                        placeholder="Lastname"
                        value={form.lastname}
                        onChangeText={(lastname) =>
                            setForm({
                                ...form,
                                lastname:
                                    lastname.length === 0 ? null : lastname,
                            })
                        }
                        leftIcon={<FontAwesomeIcon icon={faUser} size={24} />}
                        errorMessage={form.errorLastname}
                        errorStyle={globalStyles.error}
                    />
                    <Text style={globalStyles.textForm}>
                        Username
                        <Text style={{ color: "#cc0000" }}>*</Text>
                    </Text>
                    <Input
                        inputStyle={globalStyles.inputLabel}
                        inputContainerStyle={globalStyles.inputContainer}
                        placeholder="Username"
                        value={form.username}
                        onChangeText={(username) =>
                            setForm({ ...form, username })
                        }
                        leftIcon={<FontAwesomeIcon icon={faUser} size={24} />}
                        errorMessage={form.errorUsername}
                        errorStyle={globalStyles.error}
                    />
                    <Text style={globalStyles.textForm}>
                        Email
                        <Text style={{ color: "#cc0000" }}>*</Text>
                    </Text>
                    <Input
                        inputStyle={globalStyles.inputLabel}
                        inputContainerStyle={globalStyles.inputContainer}
                        placeholder="Email"
                        value={form.email}
                        onChangeText={(email) => setForm({ ...form, email })}
                        leftIcon={
                            <FontAwesomeIcon icon={faEnvelope} size={24} />
                        }
                        errorMessage={form.errorMail}
                        errorStyle={globalStyles.error}
                        autoCapitalize={"none"}
                        keyboardType={"email-address"}
                    />
                    <Text style={globalStyles.textForm}>
                        Password
                        <Text style={{ color: "#cc0000" }}>*</Text>
                    </Text>

                    <Input
                        inputStyle={globalStyles.inputLabel}
                        inputContainerStyle={globalStyles.inputContainer}
                        placeholder="Password"
                        value={form.password}
                        onChangeText={(password) =>
                            setForm({ ...form, password })
                        }
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
                        errorMessage={form.errorPassword}
                        errorStyle={globalStyles.error}
                    />
                    <Text style={globalStyles.textForm}>
                        Repeat Password
                        <Text style={{ color: "#cc0000" }}>*</Text>
                    </Text>
                    <Input
                        inputStyle={globalStyles.inputLabel}
                        inputContainerStyle={globalStyles.inputContainer}
                        placeholder="Repeat password"
                        value={form.repeatPassword}
                        onChangeText={(repeatPassword) =>
                            setForm({ ...form, repeatPassword })
                        }
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
                    />
                    <Text style={{ color: "#cc0000", paddingLeft: 10 }}>
                        * Required fields
                    </Text>
                </View>
                <Button
                    title="Register"
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
                    onPress={register}
                />
                <Button
                    title="Already have an account ?"
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
                        navigation.navigate("SignIn");
                    }}
                />
            </SafeAreaView>
        </ScrollView>
    );
}

export default SignUp;
