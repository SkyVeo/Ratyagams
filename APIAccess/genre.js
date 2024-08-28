import axios from "axios";
import { API_URL } from "../tools/constants";

/**
 * Get genres
 *
 * @param {number=} id the id of the genre to get; if not specified, all genres are returned
 *
 * @returns {Array} Array of genres
 *
 * @throws {Error} if the request failed
 */
async function getGenres(id, alphabetical) {
    return (
        await axios.get(`${API_URL}/genre`, {
            params: { id, alphabetical },
        })
    ).data;
}

export { getGenres };
