import { Dimensions, View, Text, Image, Pressable, StyleSheet, ScrollView, FlatList, Linking, Alert } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Tab, TabView, AirbnbRating, Button, Dialog, CheckBox } from "@rneui/themed";
import { useState, useEffect, useCallback } from "react";
import { getPublications } from "../../APIAccess/publication";
import { getGamesByVideoGame, updateGame, createGame } from "../../APIAccess/game";
import Header from "../Global/Header";
import { DARK_GREY, GREEN, API_BASE_URL } from "../../tools/constants";
import UpdateReview from "./UpdateReviewModal";
import { useSelector } from 'react-redux';
import ErrorText from "../Utils/ErrorText";

const IMAGE_WIDTH = Dimensions.get("window").width / 3;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.36;

/**
 * This function is used to do the steps following the press on the check box
 *
 * @param {Array} gameReviews The different reviews of the game made by the user
 * @param {object} actualPublication The object containing the publication displayed on the page
 * @param {object} actualReview The object containing the review of the publication displayed
 *
 * @returns {Array} Array containing all the reviews of the user for the video game 
 */
function CheckBoxInit(gameReviews, actualPublication, actualReview) {
    let reviewExist = false;
    gameReviews.forEach(review => {
        if (actualPublication.id === review.publication_id) {
            reviewExist = true;
        }
    });
    let newReviews = [];
    if (reviewExist) {
        updateGame(actualPublication.id,
            {
                is_owned: !actualReview.is_owned
            },token).catch((error) => {
                if (error.response?.data?.code.includes("JWT")) {
                    navigation.navigate("SignIn", { message: "The software doesn't recognize you, please sign in again!" });
                }
                else {
                    return (<ErrorText errorMessage="An error occured, please try later!" />);
                }
            });
        newReviews = gameReviews.map(review => {
            if (review.publication_id === actualPublication.id) {
                review.is_owned = !actualReview.is_owned;
            }
            return review;
        });
    }
    else {
        createGame({
            publication_id: actualPublication.id,
            is_owned: true,
            review_rating: 0,
            review_comment: null,
            review_date: null
        },token).catch((error) => {
            if (error.response?.data?.code.includes("JWT")) {
                navigation.navigate("SignIn", { message: "The software doesn't recognize you, please sign in again!" });
            }
            else {
                return (<ErrorText errorMessage="An error occured, please try again!" />);
            }
        });
        actualReview = {
            publication_id: actualPublication.id,
            is_owned: true,
            review_rating: 0,
            review_comment: null,
            review_date: null
        };
        newReviews = gameReviews;
        newReviews.push(actualReview);
    }
    return newReviews;
}

/**
 * Page with all the data that will be displayed about a game
 *
 * @param {object} props
 * @param {object} props.route The route containing the parameters
 * @param {number} props.route.params.videoGameId The id of the video game that will be displayed on the screen
 * @param {string=} props.route.params.actualPlatform The code of the platform of the publication that the user chosed, if it's not provided, it will get the favorite platform of a user
 *
 * @returns {JSX.Element} The game preview page displayed
 */
function GamePreview({ route, navigation }) {
    const token = useSelector((state) => state.token.token);
    const { videoGameId, actualPlatform } = route.params;
    const platforms = useSelector(state => state.platformList.platforms);

    const [gamePreviews, setGamePreviews] = useState(new Map());
    const [gameReviews, setGameReviews] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [checked, setChecked] = useState(false);

    const [load, setLoad] = useState({
        loading: true,
        errorMessage: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const publications = await getPublications({ videoGameId: videoGameId, getVideoGamesInfo: true },token);
                const videoGamePlatforms = platforms.filter((platform) => {
                    return publications.some((publication) => {
                        return platform.code === publication.platform_code;
                    })
                });

                getGamesByVideoGame(videoGameId,token).then((response) => {
                    setGameReviews(response);
                }).catch((error) => {
                    if (error.response?.data.code?.includes("JWT")) {
                        navigation.navigate("SignIn", { message: "The software doesn't recognize your account, please sign in again!" });
                    }
                    else {
                        return (<ErrorText errorMessage="An error occured, please try again in a few minutes!" />);
                    }
                });
                const previews = new Map();
                videoGamePlatforms.forEach(platform => {
                    const values = publications.find(element =>
                        element.platform_code === platform.code
                    );
                    previews.set(platform, values);
                });
                setGamePreviews(new Map(previews));
                setLoad({
                    loading: false,
                    errorMessage: "",
                });
            } catch (error) {
                setLoad({
                    loading: false,
                    errorMessage: "An error occured, please try again later!",
                });
            }
        }
        fetchData();
    }, []);

    const keys = Array.from(gamePreviews.keys());
    const actualPublication = gamePreviews.get(keys.find(platform => platform.code === actualPlatform));
    const actualReview = gameReviews.find((review) => review.publication_id === actualPublication.id);

    useEffect(() => {
        if (actualReview && actualReview.is_owned !== checked) {
            setChecked(actualReview.is_owned);
        }
    }, [actualReview]);

    /**
    * This function create the different parts displayed on screen
    *
    * @returns {JSX.Element} Interior of the game preview page
    */
    const renderPreviews = () => {
        return (
            <>
                <View style={{ flexDirection: 'row' }}>
                    <Pressable onPress={navigation.goBack}>
                        <FontAwesomeIcon icon={faArrowLeft} size={40} style={{ color: GREEN }} />
                    </Pressable>
                    <Text style={[globalStyles.whiteText, { marginLeft: 12, marginTop: 2 }, styles.name]}>
                        {actualPublication.name}
                    </Text>
                </View>
                <View style={globalStyles.containerInsideView}>
                    <View style={{ height: IMAGE_HEIGHT, marginTop: 15 }}>
                        <Image
                            style={{ height: IMAGE_HEIGHT, width: IMAGE_WIDTH }}
                            source={{ uri: `${API_BASE_URL}/videoGame/${videoGameId}.png` }}
                        />
                        <View style={{ position: "absolute", alignSelf: "center", top: IMAGE_HEIGHT - 40 }}>
                            <CheckBox
                                checked={checked}
                                checkedIcon={<FontAwesomeIcon icon={faCircleCheck} size={40} style={{ color: GREEN }} />}
                                uncheckedIcon={<FontAwesomeIcon icon={faCircleXmark} size={40} style={{ color: "red" }} />}
                                onPress={() => {
                                    const newReviews = CheckBoxInit(gameReviews, actualPublication, actualReview);
                                    setGameReviews(newReviews);
                                    setChecked(!checked);
                                }}
                                containerStyle={{ backgroundColor: "transparent" }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 18, maxWidth: 142 }}>
                        <Text style={[globalStyles.greenText, styles.informationsTitle]}>
                            Release date (D/M/Y)
                        </Text>
                        <Text style={actualPublication.release_date ? [globalStyles.whiteText, styles.informationsText] : styles.unknown}>
                            {actualPublication.release_date ? new Date(actualPublication.release_date).toLocaleDateString() : "Unknown"}
                        </Text>
                        <Text style={[globalStyles.greenText, styles.informationsTitle]}>
                            Release price
                        </Text>
                        <Text style={actualPublication.release_price ? [globalStyles.whiteText, styles.informationsText] : styles.unknown}>
                            {actualPublication.release_price ? actualPublication.release_price + "€" : "Unknown"}
                        </Text>
                        <Text style={[globalStyles.greenText, styles.informationsTitle]}>
                            Platforms
                        </Text>
                        <FlatList
                            data={Array.from(gamePreviews.keys())}
                            renderItem={({ item, index }) => {
                                const isEnd = index === Array.from(gamePreviews.keys()).length - 1;
                                let boldPlatform = "normal";
                                let underlined = "none";
                                if (item.code === actualPlatform) {
                                    boldPlatform = "bold";
                                }
                                else {
                                    underlined = "underline";
                                }
                                return (
                                    <Pressable onPress={() => {
                                        navigation.setParams({ actualPlatform: item.code });
                                    }} style={{ flexDirection: "row" }}>
                                        <Text
                                            style={[
                                                globalStyles.whiteText,
                                                styles.informationsText,
                                                {
                                                    fontWeight: boldPlatform,
                                                    textDecorationLine: underlined
                                                }]}
                                        >
                                            {item.abbreviation}
                                        </Text>
                                        <Text style={[
                                            globalStyles.whiteText,
                                            styles.informationsText]}>
                                            {isEnd ? "" : ", "}
                                        </Text>
                                    </Pressable>
                                )
                            }}
                            horizontal={true} />
                        <OpenURLButton url={actualPublication.store_page_url} />
                    </View>
                </View>
                <Tab value={index} onChange={(e) => setIndex(e)} indicatorStyle={{ backgroundColor: GREEN }}>
                    <Tab.Item
                        title={"Synopsis"}
                        titleStyle={(active) => ({
                            color: active ? GREEN : "#fff",
                            fontSize: 24,
                            fontWeight: "bold"
                        })} />
                    <Tab.Item
                        title={"My review"}
                        titleStyle={(active) => ({
                            color: active ? GREEN : "#fff",
                            fontSize: 24,
                            fontWeight: "bold"
                        })} />
                </Tab>
                <TabView value={index} onChange={setIndex} animationType="spring">
                    <TabView.Item style={{ width: '100%' }}>
                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            <Text style={
                                [actualPublication.description ? styles.textStyle : [styles.textStyle, { color: "grey" }], { fontSize: 15 }]
                            }>
                                {actualPublication.description ? actualPublication.description : "Unknown"}
                            </Text>
                        </ScrollView>
                    </TabView.Item>
                    <TabView.Item style={{ width: '100%' }}>
                        <ScrollView contentContainerStyle={{ padding: 20, alignSelf: "center" }}>
                            <AirbnbRating
                                showRating={false}
                                size={30}
                                defaultRating={actualReview ? actualReview.review_rating : 0}
                                onFinishRating={(number) => setRating(number)}
                                isDisabled={true}
                            />
                            <Text
                                style={[styles.textStyle, (actualReview ? globalStyles.whiteText : { color: "grey" }), { fontSize: 15 }]}
                            >
                                {actualReview && actualReview.review_comment ? actualReview.review_comment : "No comment for the moment"}
                            </Text>
                            <Button
                                title={"Modify"}
                                titleStyle={{ fontWeight: "700" }}
                                buttonStyle={{
                                    backgroundColor: GREEN,
                                    borderWidth: 0,
                                    borderRadius: 20,
                                }}
                                containerStyle={globalStyles.modifyButtonContainer}
                                onPress={() => {
                                    setModalVisible(true);
                                }}
                                disabled={!actualReview}
                                disabledStyle={{
                                    backgroundColor: "#59A52C99",
                                    borderWidth: 0,
                                    borderRadius: 20,
                                }}
                            />
                        </ScrollView>
                    </TabView.Item>
                </TabView>
                <UpdateReview
                    isVisible={modalVisible}
                    onClose={({ comment = undefined, rating = undefined }) => {
                        setModalVisible(false);
                        if (comment !== undefined || rating !== undefined) {
                            const newReviews = gameReviews.map(review => {
                                if (review.publication_id === actualPublication.id) {
                                    review.review_comment = comment;
                                    review.review_rating = rating;
                                }
                                return review;
                            });
                            setGameReviews(newReviews);
                        }
                    }}
                    publicationId={actualPublication.id}
                    comment={actualReview ? actualReview.review_comment : null}
                    rating={actualReview ? actualReview.review_rating : 0}
                />
            </>
        );
    }

    const [index, setIndex] = useState(0);

    /**
    * This function check if the URL entered is a supported URL and open it if supported.
    * 
    * @param {object} params
    * @param {string} params.url The URL to the official webstore
    *
    * @returns {JSX.Element} The button to click on to be directed to the webstore
    */
    const OpenURLButton = ({ url }) => {
        const handlePress = useCallback(async () => {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert(`This is an invalid URL. Please forgive us for this problem!`);
            }
        }, [url]);

        return <Button
            title={"Store Page"}
            titleStyle={
                styles.buttonTextStyle}
            buttonStyle={{
                backgroundColor: GREEN,
                borderWidth: 0,
                borderRadius: 20,
            }}
            containerStyle={
                styles.storeButton
            }
            disabled={url ? false : true}
            disabledStyle={{ backgroundColor: '#59A52C99' }}
            onPress={handlePress} />;
    };

    let content;
    if (load.loading) {
        content = (
            <>
                <Pressable onPress={navigation.goBack}>
                    <FontAwesomeIcon icon={faArrowLeft} size={40} style={{ color: GREEN }} />
                </Pressable>
                <Dialog.Loading loadingProps={{ color: GREEN }} />
            </>
        );
    } else if (load.errorMessage) {
        content = <ErrorText errorMessage={load.errorMessage} />;
    } else {
        content = renderPreviews();
    }

    return (
        <>
            <Header />
            <View
                style={{
                    padding: 10,
                    backgroundColor: DARK_GREY,
                    flexGrow: 1
                }}
            >
                {content}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    name: {
        fontSize: 20
    },
    informationsTitle: {
        fontSize: 12,
        marginTop: 10
    },
    informationsText: {
        fontSize: 16,
        fontWeight: "bold"
    },
    unknown: {
        fontSize: 16,
        fontWeight: "bold",
        color: "grey"
    },
    storeButton: {
        marginTop: 11,
        marginLeft: 1,
        width: 150,
        height: 50
    },
    buttonTextStyle: {
        fontWeight: "400",
        textAlign: "center",
        fontSize: 16,
        fontStyle: "normal"
    },
    textStyle: [
        globalStyles.containerInsideView,
        globalStyles.whiteText,
        { textAlign: "justify" }
    ]
});

export default GamePreview;