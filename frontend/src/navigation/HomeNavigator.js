import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RecentScreen from '../screens/RecentScreen'; // Add this import
import FavouriteScreen from '../screens/FavouriteScreen'; // Add this import
import SettingScreen from '../screens/SettingScreen'; // Add this import
import TellAFriendScreen from '../screens/TellAFriendScreen'; // Add this import
import SidebarMenu from '../components/SideBarMenu';


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
        </Drawer.Navigator>
    );
}

export default function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
            {/* <Stack.Screen name="Favourites" component={DrawerNavigator} />
            <Stack.Screen name="Settings" component={DrawerNavigator} /> */}
        </Stack.Navigator>
    );
}