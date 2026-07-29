import { Image, Text, View } from "react-native";
import '../../global.css'
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/ThemeProvide";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { rootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";

type props = NativeStackNavigationProp<rootStack, "SplashScreen">

export default function SplashScreen() {

    const navigation = useNavigation<props>();
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 3000 });

        const timer = setTimeout(() => {
            // navigation.replace("SignUpScreen");
        }, 3000);

        return () => {
            clearTimeout(timer);
        }
    }, [navigation, opacity]);

    const animatedStyle = useAnimatedStyle(() => {
        return { opacity: opacity.value }
    });

    const { applied } = useTheme();
    const logo = applied === "dark" ? require("../../assets/logo-dark-tp.png") : require("../../assets/logo-light-tp.png");

    return (
        <View className="flex-1 justify-center items-center bg-slate-50 dark:bg-slate-950">
            <StatusBar hidden={true} />
            <Animated.View style={animatedStyle}>
                <Image source={logo} className="w-[300] h-[300]" />
            </Animated.View>
            <Animated.View className="absolute bottom-[50] flex justify-center items-center" style={animatedStyle}>
                <Text className="text-xs text-gray-600 font-semibold">POWERED BY : SYNAPSE SYSTEMS</Text>
                <Text className="text-xs text-gray-600 font-semibold mt-2">VERSION   |   1.0</Text>
            </Animated.View>
        </View>
    )
}

