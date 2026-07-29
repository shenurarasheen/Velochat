import { ArrowRight } from "lucide-react-native";
import { Image, Pressable, ScrollView, StatusBar, Text, TextInput, View } from "react-native";
import VerifyInput from "../components/VerifyInput";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { rootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import BottomContent from "../components/BottomContent";
import { validateOTP } from "../util/Validation";
import { useUserRegistration } from "../components/UserContext";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { sendEnteredOtp } from "../api/UserService";
import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";

type verifyProps = NativeStackNavigationProp<rootStack, "VerifyScreen">

export default function VerifyScreen() {

    const navigation = useNavigation<verifyProps>();
    const {userData, setUserData} = useUserRegistration();
    const auth = useContext(AuthContext);

    return (
        <ScrollView className="flex-1 bg-white">
            <StatusBar hidden={true} />
            <View className="h-screen justify-center items-center p-8">
                <View className="w-full flex flex-col items-center">
                    <Image source={require("../../assets/logo-only.png")} className="size-20 mb-10" />
                    <Text className="text-center text-3xl font-medium">Verify it's you</Text>
                    <Text className="text-lg text-center mt-8">A verification code has been sent to <Text className="font-semibold">{auth?.mode === "signUp" && userData?.email + " and"} </Text><Text className="font-semibold">{userData.countryCode + " " + userData.contactNo}</Text></Text>
                    <Text className="text-center mt-8 text-gray-500">Please check your inbox and enter the verification below to verify your account</Text>

                    <View className="w-[70%] mt-8 flex-row grid grid-cols-5 gap-3 justify-center">
                        <VerifyInput />
                    </View>

                    <Pressable
                        className="w-full bg-indigo-600 p-3 mt-12 flex-row justify-center items-center rounded-lg gap-2"
                        onPress={async () => {
                            let validOTP = validateOTP(userData.otp);

                            if (validOTP) {
                                Toast.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: "Warning",
                                    textBody: validOTP
                                });

                                return;
                            }

                            //need to send otp to backend
                            const res = await sendEnteredOtp(userData.countryCode, userData.contactNo, userData.otp, auth?.mode);
                            if (res.status) {
                                if (auth?.mode === "signIn") {
                                    const userId = String(res.userId);
                                    auth.signIn(userId);
                                    //navigation.navigate("VerificationSuccessScreen");
                                } else {                 
                                    navigation.navigate("VerificationSuccessScreen");
                                }
                            } else {
                                Toast.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: "Warning",
                                    textBody: res.message
                                });
                            }
                            
                        }}
                    >
                        <Text className="text-lg text-white font-semibold">Next</Text>
                        <ArrowRight size={22} color="white" />
                    </Pressable>

                    <Pressable className="w-full p-3 mt-5 flex-row justify-center items-center rounded-lg gap-2" onPress={() => navigation.goBack()}>
                        <Text className="text-lg text-indigo-600 font-semibold">Back</Text>
                    </Pressable>
                </View>
            </View>

            <BottomContent screenNo={3} />
        </ScrollView>
    )
}