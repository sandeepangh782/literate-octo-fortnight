import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RecentScreen from '../screens/RecentScreen';
import FavouriteScreen from '../screens/FavouriteScreen';
import SettingScreen from '../screens/SettingScreen';
import TellAFriendScreen from '../screens/TellAFriendScreen';
import SidebarMenu from '../components/SideBarMenu';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import BeachDetailsScreen from '../screens/BeachDetailsScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <SidebarMenu {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            <Drawer.Screen name="Recents" component={RecentScreen} />
            <Drawer.Screen name="Favourites" component={FavouriteScreen} />
            <Drawer.Screen name="Settings" component={SettingScreen} />
            <Drawer.Screen name="TellAFriend" component={TellAFriendScreen} />
            <Drawer.Screen name="BeachDetails" component={BeachDetailsScreen} />

        </Drawer.Navigator>
    );
}

export default function HomeNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
            <Stack.Screen name="BeachDetails" component={BeachDetailsScreen} />
        </Stack.Navigator>
    );
}