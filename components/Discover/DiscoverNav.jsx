import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Discover from './Discover';
import Games from '../GameSearch/Games';

const Stack = createNativeStackNavigator();

/**
 * Function creating a new nested stack navigator inside of the discover page
 *
 * @returns {JSX.Element} header of the application
 */
export default function DiscoverNav() {
    return (
        <Stack.Navigator initialRouteName="Discover" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Discover" component={Discover} />
            <Stack.Screen name="Games" component={Games} />
        </Stack.Navigator>
    );
}