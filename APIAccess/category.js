import axios from "axios";
import { API_URL } from "../tools/constants";

/**
 * Get categories
 *
 * @param {number=} genreId the id of the genre
 * @param {number=} videoGameId the id of the video game
 *
 * @returns {Array} Array of categories
 *
 * @throws {Error} if the request failed
 */
async function getCategory(genreId, videoGameId, token) {
    return (
        await axios.get(`${API_URL}/category`, {
            headers: { Authorization: token },
            params: { genreId, videoGameId },
        })
    ).data;
}

export { getCategory };