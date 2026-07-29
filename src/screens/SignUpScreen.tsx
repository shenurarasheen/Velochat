import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Mail, User } from "lucide-react-native";
import { Image, ImageBackground, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { rootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import '../../global.css';
import BottomContent from "../components/BottomContent";
import { useUserRegistration } from "../components/UserContext";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { validateEmail, validateFullName } from "../util/Validation";
import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";

type SignUpProps = NativeStackNavigationProp<rootStack, "SignUpScreen">

export default function SignUpScreen() {

    const navigation = useNavigation<SignUpProps>();
    const { userData, setUserData } = useUserRegistration();
    const auth = useContext(AuthContext);

    return (
        <ScrollView className="flex-1 bg-white">
            <StatusBar hidden={true} />
            <View className="h-screen justify-center items-center p-8">
                <View className="w-full flex flex-col items-center">
                    <Image source={require("../../assets/logo-only.png")} className="size-20 mb-10" />
                    <Text className="text-center text-3xl font-medium">Create Account</Text>
                    <Text className="text-center mt-5 text-gray-500">Fill your information below or register with your social account</Text>

                    <View className="w-full mt-2">
                        <View className="flex flex-row items-center mt-6">
                            <User size={18} color="gray" />
                            <Text className="text-gray-500 ml-2">Full Name</Text>
                        </View>

                        <TextInput
                            className="border-2 border-gray-500/70 rounded-xl mt-3 w-full px-4"
                            placeholder="Enter your Full Name"
                            value={userData.fullName}
                            onChangeText={(text) => {
                                setUserData((prev) => ({
                                    ...prev,
                                    fullName: text
                                }))
                            }}
                        />

                    </View>

                    <View className="w-full">
                        <View className="flex flex-row items-center mt-6">
                            <Mail size={18} color="gray" />
                            <Text className="text-gray-500 ml-2">Email</Text>
                        </View>

                        <TextInput
                            className="border-2 border-gray-500/70 rounded-xl mt-3 w-full px-4"
                            placeholder="Enter your Email"
                            value={userData.email}
                            onChangeText={(text) => {
                                setUserData((prev) => ({
                                    ...prev,
                                    email: text
                                }))
                            }}
                        />

                    </View>

                    <Pressable
                        className="w-full bg-indigo-600 p-3 mt-12 flex-row justify-center items-center rounded-lg gap-2"
                        onPress={
                            () => {
                                auth?.changeMode("signUp");
                                let validFullName = validateFullName(userData.fullName);
                                let validEmail = validateEmail(userData.email);

                                if (validFullName) {
                                    Toast.show({
                                        type: ALERT_TYPE.WARNING,
                                        title: "Warning",
                                        textBody: validFullName
                                    });
                                    return;
                                }

                                if (validEmail) {
                                    Toast.show({
                                        type: ALERT_TYPE.WARNING,
                                        title: "Warning",
                                        textBody: validEmail
                                    });
                                    return;
                                }

                                navigation.navigate("ContactScreen");
                            }
                        }
                    >
                        <Text className="text-lg text-white font-semibold">Next</Text>
                        <ArrowRight size={22} color="white" />
                    </Pressable>
                    <Pressable  
                    className="w-full flex-row justify-center items-center mt-6"
                    onPress={() => {
                        auth?.changeMode("signIn");
                        navigation.navigate("ContactScreen");
                    }}
                    >
                        <Text className="text-lg text-indigo-500 font-semibold">Sign In</Text>
                    </Pressable>
                </View>

            </View>

            <BottomContent screenNo={1} />
        </ScrollView>

    )
}
