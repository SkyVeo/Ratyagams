import {
    isValidEmail,
    isValidPassword,
    isValidLastNameOrFirstName,
} from "./utils.jsx";

/**
 * Check if the the value in the label in the form is valid
 * 
 * @param {Object} form - The form
 * @param {string} form.username - The username
 * @param {string} form.email - The email
 * @param {string} form.password - The password
 * @param {string} form.repeatPassword - The repeated password
 * @param {string} form.firstname - The firstname
 * @param {string} form.lastname - The lastname
 * @param {Object} form.errorFirstname - The error of the firstname
 * @param {Object} form.errorLastname - The error of the lastname
 * @param {Object} form.errorUsername - The error of the username
 * @param {Object} form.errorMail - The error of the email
 * @param {Object} form.errorPassword - The error of the password
 * @param {Function} setForm - The function to set the form
 * @returns {Promise<Boolean>} - `true` if the form is valid, `false` otherwise
 */
function isValidForm(form, setForm, modifyAccount = false) {
    let isValid = true;
    const error = {
        errorFirstname: "",
        errorLastname: "",
        errorUsername: "",
        errorMail: "",
        errorPassword: "",
    };
    const { username, email, password, repeatPassword, firstname, lastname } =
        form;

    if (firstname && !isValidLastNameOrFirstName(firstname)) {
        error.errorFirstname =
            "First name must start with a capital letter and contain only letters";
        isValid = false;
    }

    if (lastname && !isValidLastNameOrFirstName(lastname)) {
        error.errorLastname =
            "Last name must start with a capital letter and contain only letters";
        isValid = false;
    }

    if (!username) {
        error.errorUsername = "Username is missing";
        isValid = false;
    } else if (username.length < 3 || username.length > 20) {
        error.errorUsername = "Username must be between 3 and 20 characters";
        isValid = false;
    }

    if (!email) {
        error.errorMail = "Email is missing";
        isValid = false;
    } else if (!isValidEmail(email)) {
        error.errorMail = "Invalid email";
        isValid = false;
    }

    if (!modifyAccount) {
        if (!password) {
            error.errorPassword = "Password is missing";
            isValid = false;
        } else if (!isValidPassword(password)) {
            error.errorPassword =
                "• Should be 8-20 characters\n• Should have a lower case letter\n• Should have a upper case letter\n• Should have a number";
            isValid = false;
        } else if (password !== repeatPassword) {
            error.errorPassword =
                "Password and repeat password are not the same";
            isValid = false;
        }
    }
    setForm({ ...form, ...error });
    return isValid;
}

export { isValidForm };