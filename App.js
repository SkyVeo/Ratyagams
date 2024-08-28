import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faMagnifyingGlass, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import store from './store'
import { Provider } from 'react-redux'
import SignUp from './components/Authentification/SignUp';
import SignIn from './components/Authentification/SignIn';
import Account from './components/Account/Account';
import DiscoverNav from './components/Discover/DiscoverNav';
import Games from './components/GameSearch/Games';
import Settings from './components/Account/Settings';
import GamePreview from './components/GamePreview/GamePreview';
import LoadingPage from './components/Global/LoadingPage';
import { DARK_GREY, GREEN, LIGHT_GREY } from "./tools/constants"

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Home() {
    return (
        <Tab.Navigator
            initialRouteName="DiscoverNav"
            screenOptions={{
                headerShown: false,
                tabBarInactiveTintColor: "white",
                tabBarActiveTintColor: GREEN,
                tabBarActiveBackgroundColor: LIGHT_GREY,
                tabBarInactiveBackgroundColor: DARK_GREY,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    height: 80,
                    borderTopWidth: 0,
                },
                tabBarLabelStyle: {
                    marginBottom: 15,
                    fontSize: 13
                }
            }}>
            <Tab.Screen
                initialParams={{
                    screen: 'Home/Games',
                }}
                options={{
                    unmountOnBlur: true,
                    tabBarLabel: "GAMES",
                    tabBarIcon: ({ color }) => (<FontAwesomeIcon icon={faGamepad} size={30} style={{ color: color }} />),
                }}
                name="Games"
                component={Games}
            />
            <Tab.Screen
                initialParams={{
                    screen: 'Home/Discover',
                }}
                options={{
                    unmountOnBlur: true,
                    tabBarLabel: "DISCOVER",
                    tabBarIcon: ({ color }) => (<FontAwesomeIcon icon={faMagnifyingGlass} size={24} style={{ color: color }} />)
                }}
                name="DiscoverNav"
                component={DiscoverNav}
            />
            <Tab.Screen
                initialParams={{
                    screen: 'Home/Account',
                }}
                options={{
                    unmountOnBlur: true,
                    tabBarLabel: "ACCOUNT",
                    tabBarIcon: ({ color }) => (<FontAwesomeIcon icon={faUser} size={24} style={{ color: color }} />)
                }}
                name="Account"
                component={Account}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    const MyTheme = {
        dark: true,
        colors: {
            background: DARK_GREY
        }
    }
    return (
        <Provider store={ store }>
            <NavigationContainer theme={MyTheme}>
                <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="SignIn" component={SignIn} />
                    <Stack.Screen name="SignUp" component={SignUp} />
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="Settings" component={Settings} />
                    <Stack.Screen name="GamePreview" component={GamePreview} />
                    <Stack.Screen name="LoadingPage" component={LoadingPage} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}