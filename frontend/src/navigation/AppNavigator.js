import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>

                <Stack.Screen name="Login" component={LoginScreen} />

                <Stack.Screen name="Register" component={RegisterScreen} />

                <Stack.Screen name="Home" component={HomeScreen} />

                {/* Add more screens here */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
