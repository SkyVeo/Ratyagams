import axios from "axios";
import { API_URL } from "../tools/constants";

/**
 * Create a new user
 *
 * @param {object} user user object
 * @param {string} user.firstname first name of the user
 * @param {string} user.lastname last name of the user
 * @param {string} user.username username of the user
 * @param {string} user.email email of the user
 * @param {string} user.password password of the user
 *
 * @throws {Error} if the request failed
 *
 * @returns {Promise<void>}
 */
async function postUser(user) {
    await axios.post(API_URL + "/user", {
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        password: user.password,
    });
}

/**
 * Connect the user and save the token
 *
 * @param {object} user user object
 * @param {string} user.login login of the user
 * @param {string} user.password password of the user
 *
 * @throws {Error} if the request failed
 *
 * @returns {Promise<void>}
 */
async function connection(user) {
    return (await axios.post(API_URL + "/user/login", user)).data.token;
}

/**
 * Get the user associated with the token
 *
 * @throws {Error} if the request failed
 * @returns {Promise<object>} user object
 */
async function getUser(token) {
    return (
        await axios.get(API_URL + "/user/me", {
            headers: { Authorization: token },
        })
    ).data;
}

/**
 * Update the user associated with the token
 *
 * @param {object} updatedValues updated values of the user
 * @param {string=} updatedValues.firstname first name of the user
 * @param {string=} updatedValues.lastname last name of the user
 * @param {string=} updatedValues.username username of the user
 * @param {string=} updatedValues.email email of the user
 *
 * @throws {Error} if the request failed
 *
 * @returns {Promise<void>}
 */
async function updateUser(updatedValues, token) {
    await axios.patch(API_URL + "/user/", updatedValues, {
        headers: { Authorization: token },
    });
}

/**
 * Delete the user associated with the token
 *
 * @throws {Error} if the request failed
 *
 * @returns {Promise<void>}
 */
async function deleteUser(token) {
    await axios.delete(API_URL + "/user/", {
        headers: { Authorization: token },
    });
}

export { postUser, connection, getUser, updateUser, deleteUser };