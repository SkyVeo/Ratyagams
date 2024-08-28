import axios from "axios";
import { API_URL } from "../tools/constants";
import { getCategory } from "./category";
import { getPlatforms } from "./platform";
import { addNewGames } from "../store/slice/newGames";
import { addPlatform } from "../store/slice/platform";

/**
 * Get publications
 *
 * @param {Object} options
 * @param {number=} options.publicationId the id of the publication
 * @param {number=} options.videoGameId the id of the video game
 * @param {string=} options.videoGameName the name of the video game
 * @param {string=} options.platformCode the platform code of the video game
 * @param {boolean=} options.getOwnGames if `true`, only the games of the user are returned; default `false`
 * @param {number[]=} options.genresIds the genres of the video game
 * @param {boolean=} options.getLastGames if `true`, only the last games are returned; default `false`
 * @param {boolean=} options.getVideoGamesInfo if `true`, the video game info is returned; default `false`
 * @param {boolean=} options.alphabetical if `true`, the publications are sorted alphabetically; default `false`
 * @param {boolean=} options.sortByDate if `true`, the publications are sorted by date (newest first); default `false`
 * @param {number=} options.page the page of the results
 * @param {number=} options.limit the number of results per page
 *
 * @returns {Promise<Object[]>} A promise containing an array of publications
 *
 * @throws {Error} if the request failed
 */
async function getPublications(options,token) {
    options.genresIds =
        options.genresIds?.map((genreId) => genreId.toString()).join(",") ||
        undefined;

    return (await axios.get(`${API_URL}/publication`, {
        headers: { Authorization: token },
        params: options,
    })).data;
}


// TODO promise return
// TODO remove
/**
 * Get all video games with their platforms and genres
 *
 * @param {string=} platformCode the platform code of the video game
 * @param {number[]=} genresIds the genres of the video game
 * @param {string=} videoGameName the name of the video game
 * @param {boolean=} getOwnGames if `true`, only the games of the user are returned; default `false`
 * @param {number=} page the page of the results
 * @param {number=} limit the number of results per page
 *
 * @returns {Promise<VideoGame[]>} A promise containing an array of video games (keys: `id`, `name`, `description`, `platforms`, `genresIds`)
 *
 * @throws {Error} if the request failed
 */
async function getVideoGamesWithPlatformsAndGenres(
    platformCode,
    videoGameName,
    genresIds,
    getOwnGames = false,
    page,
    limit,
    token
) {
    const videoGames = [];
    const categories = await getCategory();
    const publications = await getPublications({
        platformCode,
        videoGameName,
        genresIds,
        getVideoGamesInfo: true,
        getOwnGames,
        alphabetical: true,
        page,
        limit,
        token
    });
    publications.forEach((publication) => {
        const videoGame = videoGames.find(
            (videoGame) => videoGame.id === publication.video_game_id
        );
        if (videoGame) {
            videoGame.platforms.push(publication.platform_code);
        } else {
            videoGames.push({
                id: publication.video_game_id,
                name: publication.name,
                description: publication.description,
                platforms: [publication.platform_code],
                genresIds: categories
                    .filter(
                        (category) =>
                            category.video_game_id === publication.video_game_id
                    )
                    .map((category) => category.genre_id),
            });
        }
    });

    return videoGames;
}

async function fillingData(platforms, newGames, dispatch) {
    
    const fillData = (allPlatforms, allGames) => {
        const publicationsToAdd = {};
        const filterPlatform = allPlatforms.filter((platform) => {
            return allGames.some(element => {
                if (typeof element === "string") {
                    return element === platform.code;
                }
                return element.platform_code === platform.code;
            });
        });
        
        if (!(typeof allGames[0] === "string")) {
            allGames.forEach(element => {
                publicationsToAdd[element.platform_code] ??= [];
                publicationsToAdd[element.platform_code].push(element);
            });
        }
        const platformsToAdd = [];
        filterPlatform.forEach((platform) => {
            platformsToAdd.push(platform);
        });
        if (Object.keys(publicationsToAdd).length === 0) {
            return {platformsToAdd, publicationsToAdd : newGames};
        }
        return {platformsToAdd, publicationsToAdd};
    }

    if (Object.keys(newGames).length === 0) {
        try {
            const newPublications = [];
            const allPlatforms = await getPlatforms();
            const response = []
            for (const platform of allPlatforms){
                try {
                    dispatch(addPlatform(platform));
                    response.push(await getPublications({ platformCode: platform.code, getLastGames: true }));
                } catch (error) {
                    if (error.response?.request?.status !== 404) {
                        console.log(error);
                    }
                }
            }
            response.forEach((publications)=> {
                publications.forEach(publication => {
                    let alreadyInNewGames = false;
                    if(newGames[publication.platform_code]){
                        newGames[publication.platform_code].forEach((game) => {
                            if(game.id === publication.id){
                                alreadyInNewGames = true;
                            }
                        });
                    }
                    if(!alreadyInNewGames){
                        dispatch(addNewGames({ key: publication.platform_code, values: publication }));
                        newPublications.push(publication);
                    }
                });
            });
            return fillData(allPlatforms, newPublications);
        } catch (error) {
            if (error.response?.request?.status !== 404) {
                console.log(error);
            }
            return;
        }
    }
    return fillData(platforms, Object.keys(newGames));
}

export { getPublications, getVideoGamesWithPlatformsAndGenres, fillingData };