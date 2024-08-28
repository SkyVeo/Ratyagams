import logo from "../../images/logo.png";
import {
    View,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Image,
} from "react-native";
import { DARK_GREY, LOAD_SIZE, GREEN } from "../../tools/constants";
import { getPlatforms } from "../../APIAccess/platform";
import { getGenres } from "../../APIAccess/genre";
import { getPublications } from "../../APIAccess/publication";
import { useEffect } from "react";
import { addNewGames } from "../../store/slice/newGames";
import { setPlatforms } from "../../store/slice/platform";
import { setGenres } from "../../store/slice/genre";
import { useSelector, useDispatch } from "react-redux";

const LOGO_SIZE = Dimensions.get("window").width * 0.5;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DARK_GREY,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        paddingBottom: 10,
    },
});

export default function LoadingPage({ navigation }) {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token.token);

    const getStoreValues = async () => {
        const [platforms, genres] = await Promise.all([
            getPlatforms(),
            getGenres(undefined, true),
        ]);

        dispatch(setPlatforms(platforms));
        dispatch(setGenres(genres));

        for (const platform of platforms) {
            try {
                const games = await getPublications(
                    {
                        platformCode: platform.code,
                        getLastGames: true,
                        sortByDate: true,
                        limit: 10,
                    },
                    token
                );
                dispatch(addNewGames({ key: platform.code, values: games }));
            } catch (error) {
                if (error.response?.data.code?.includes("JWT")) {
                    // TODO message
                    //! fais ton message fdp
                    navigation.navigate("SignIn");
                }
            }
        }
    };

    useEffect(() => {
        getStoreValues()
            .then(() => {
                navigation.navigate("Home");
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // TODO error -> signIn

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <ActivityIndicator size={LOAD_SIZE} color={GREEN} />
        </View>
    );
}
