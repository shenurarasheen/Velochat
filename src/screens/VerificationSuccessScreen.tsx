import { NativeStackNavigationOptions, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Text, View } from "react-native";
import { rootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

type VerificationSuccessProps = NativeStackNavigationProp<rootStack, "VerificationSuccessScreen">

export default function VerificationSuccessScreen() {

    const navigation = useNavigation<VerificationSuccessProps>();

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate("AvatarScreen");
        }, 2000);
    }, []);

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Image source={require("../../assets/verify.gif")}/>
            <Text className="text-3xl font-semibold mt-4">Success !</Text>
            <Text className="text-gray-600 text-lg mt-10">Your account was successfully verified !</Text>
        </View>
    )
}