
import { useEffect, useState, useRef } from "react";
import {
    Image,
    View,
    StyleSheet,
    Pressable,
    Dimensions,
    Text,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { globalStyles } from "../../styles/globalStyles";
import Header from "../Global/Header";
import {
    GREEN,
    TAB_NAVIGATOR_HEIGHT,
    HEADER_HEIGHT,
    API_BASE_URL,
    LOAD_SIZE,
} from "../../tools/constants";
import { getPublications } from "../../APIAccess/publication";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
    faChevronRight,
    faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import ErrorText from "../Utils/ErrorText";

const MAGNIFYING_GLASS_SIZE = 25;
const IMAGE_MARGIN = 5;
const IMAGE_WIDTH = Dimensions.get("window").width / 3 - IMAGE_MARGIN * 2;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.36;

const styles = StyleSheet.create({
    body: {
        paddingTop: 10,
        paddingHorizontal: 10,
        height:
            Dimensions.get("window").height -
            TAB_NAVIGATOR_HEIGHT -
            HEADER_HEIGHT,
    },
    insideFlatlist: {
        marginBottom: 20,
        marginTop: 10,
    },
    outsideFlatlist: {
        maxHeight: "100%",
    },
    magnifyingContainer: {
        position: "absolute",
        bottom:
            Dimensions.get("window").height -
            TAB_NAVIGATOR_HEIGHT -
            HEADER_HEIGHT / 2 -
            MAGNIFYING_GLASS_SIZE / 2,
        right: 15,
    },
    inner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    titleText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

/**
 * Discover page of the application which is the first page after the sign in
 *
 * @param {object} props The props object
 * @param {object} props.navigation The navigation object
 *
 * @returns {JSX.Element} header of the application
 */
export default function Discover({ navigation }) {
    const token = useSelector((state) => state.token.token);
    const platforms = useSelector((state) => state.platformList.platforms);
    const newGames = useSelector((state) => state.newGames.newGames);

    const [myGames, setMyGames] = useState([]);

    const firstLoad = useRef(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getPublications(
            { getOwnGames: true, sortByDate: true, limit: 50 },
            token
        )
            .then((videoGames) => {
                videoGames = videoGames.reduce((unique, publication) => {
                    if (
                        !unique.some(
                            (e) => e.video_game_id === publication.video_game_id
                        )
                    ) {
                        unique.push(publication);
                    }
                    return unique;
                }, []);
                setMyGames(videoGames);
            })
            .catch((error) => {
                if (error.response?.data.code?.includes("JWT")) {
                    // TODO message
                    navigation.navigate("SignIn");
                }
            });
    }, []);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
        } else {
            setIsLoading(false);
        }
    }, [myGames]);

    /**
     * Render a flatlist of video games
     *
     * @param {object[]} videoGames The video games to render (key: video_game_id, platform_code)
     *
     * @returns {JSX.Element} The flatlist of video games
     */
    const renderVideoGamesFlatlist = (videoGames) => {
        return (
            <FlatList
                data={videoGames}
                renderItem={({ item }) => (
                    <Pressable
                        style={{ marginHorizontal: IMAGE_MARGIN }}
                        onPress={() =>
                            navigation.navigate("GamePreview", {
                                videoGameId: item.video_game_id,
                                actualPlatform: item.platform_code,
                            })
                        }
                    >
                        <Image
                            style={{
                                height: IMAGE_HEIGHT,
                                width: IMAGE_WIDTH,
                            }}
                            source={{
                                uri: `${API_BASE_URL}/videoGame/${item.video_game_id}.png`,
                            }}
                        />
                    </Pressable>
                )}
                horizontal={true}
                style={styles.insideFlatlist}
            />
        );
    };

    /**
     * Render a flatlist of video games with a title
     *
     * @param {object} param0 The item of the flatlist
     * @param {object} param0.item The item of the flatlist
     * @param {string} param0.item.code The code of the platform
     * @param {string} param0.item.abbreviation The abbreviation of the platform
     *
     * @returns {JSX.Element} The flatlist of video games with a title
     */
    const renderItem = ({ item }) => {
        return (
            <View style={styles.outsideFlatlist}>
                <Pressable
                    onPress={() =>
                        item.code
                            ? navigation.navigate("Games", {
                                  defaultPlatform: item.code,
                                  sortByDate: true,
                                  getOwnGames: false,
                              })
                            : navigation.navigate("Home", {
                                  screen: "Games",
                              })
                    }
                    style={styles.titleContainer}
                >
                    <Text
                        style={[
                            globalStyles.whiteText,
                            { fontSize: 18, fontWeight: "bold" },
                        ]}
                    >
                        {item.abbreviation
                            ? `New ${item.abbreviation} Games`
                            : "My Games"}
                    </Text>
                    <FontAwesomeIcon
                        icon={faChevronRight}
                        size={15}
                        style={{ color: "white" }}
                    />
                </Pressable>
                {renderVideoGamesFlatlist(
                    item.code ? newGames[item.code] : myGames
                )}
            </View>
        );
    };

    /**
     * Render the content of the page; either a loading indicator, an error message or the flatlist of video games
     *
     * @returns {JSX.Element} The content of the page
     */
    const renderContent = () => {
        const platformsWithNewGames = platforms.filter(
            (platform) => newGames[platform.code]
        );

        if (isLoading) {
            return (
                <View style={styles.inner}>
                    <ActivityIndicator size={LOAD_SIZE} color={GREEN} />
                </View>
            );
        } else if (
            myGames.length === 0 &&
            Object.keys(platformsWithNewGames).length === 0
        ) {
            return (
                <ErrorText errorMessage="No video games has recently been added" />
            );
        } else {
            return (
                <FlatList
                    data={
                        myGames.length > 0
                            ? [{}, ...platformsWithNewGames]
                            : platformsWithNewGames
                    }
                    renderItem={renderItem}
                />
            );
        }
    };

    return (
        <View style={{ flexDirection: "column" }}>
            <Header />
            <View style={styles.body}>{renderContent()}</View>
            <View style={styles.magnifyingContainer}>
                <Pressable
                    onPress={() => {
                        navigation.navigate("Games", {
                            getOwnGames: false,
                        });
                    }}
                >
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        size={MAGNIFYING_GLASS_SIZE}
                        style={{ color: "grey" }}
                    />
                </Pressable>
            </View>
        </View>
    );
}
