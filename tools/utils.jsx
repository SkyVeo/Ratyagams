/**
 * Check if the email is valid
 * 
 * @param {string} email 
 * @returns {Boolean}
 */
function isValidEmail(email) {
    return /^[a-zA-Z0-9_.À-ú+-]+@[a-zA-ZÀ-ú0-9]+\.[a-zA-Z]+$/.test(email)
}

/**
 * Check if the password is valid
 * 
 * @param {string} password 
 * @returns {Boolean}
 */
function isValidPassword(password) {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]*).{8,}$/.test(password);
}

/**
 * Check if the lastname or firstname is valid
 * 
 * @param {string} name
 * @returns {Boolean}
 */
function isValidLastNameOrFirstName(name) {
    return /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/.test(name);
}

/**
 * Check if the username is valid
 * 
 * @param {string} username 
 * @returns {Boolean}
 */
function isValidUsername(username) {
    return /^((?!@).)*$/.test(username);
}

export {isValidEmail, isValidPassword, isValidLastNameOrFirstName, isValidUsername};