import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "./ChatScreen";
import StatusScreen from "./StatusScreen";
import CallsScreen from "./CallsScreen";

const Tabs = createBottomTabNavigator();

const HomeTabs = () => {

    return (
        <Tabs.Navigator 
        screenOptions={({route}) => ({
            tabBarIcon: ({color, size}) => {
                let iconName = "chatbubble-ellipses";
                if (route.name === "Chat") iconName = "chatbubble-ellipses"
                else if (route.name === "Status") iconName = "time"
                else if (route.name === "Calls") iconName = "call"
                return <Ionicons name={iconName as any} size={size} color={color} />
            },
            tabBarLabelStyle: {fontSize: 12},
            tabBarActiveTintColor: "#4f39f6",
            tabBarInactiveTintColor: "#9ca3af",
            tabBarStyle: {
                height: 90,
                backgroundColor: "#fff"
            }
        })}
        >
            <Tabs.Screen name="Chats" component={ChatScreen} options={{headerShown: false}}/>
            <Tabs.Screen name="Status" component={StatusScreen}></Tabs.Screen>
            <Tabs.Screen name="Calls" component={CallsScreen}></Tabs.Screen>
        </Tabs.Navigator>
    )
}

export default HomeTabs;