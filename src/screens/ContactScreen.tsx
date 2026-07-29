import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowRight, ChevronDown } from "lucide-react-native";
import { useContext, useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, TextInput, View } from "react-native";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { rootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import BottomContent from "../components/BottomContent";
import { useUserRegistration } from "../components/UserContext";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { validateContactNo, validateCountryCode, validateEmail } from "../util/Validation";
import { AuthContext } from "../components/AuthProvider";
import SignUpScreen from "./SignUpScreen";
import { verifyUser } from "../api/UserService";

type ContactProps = NativeStackNavigationProp<rootStack, "ContactScreen">

export default function ContactScreen() {

    const navigation = useNavigation<ContactProps>();

    const [countryCode, setCountryCode] = useState<CountryCode>("LK");
    const [country, setCountry] = useState<Country | null>(null);
    const [show, setShow] = useState(false);

    const { userData, setUserData } = useUserRegistration();
    const [callingCode, setCallingCode] = useState("+94");
    const [contactNo, setContactNo] = useState("");
    const auth = useContext(AuthContext);

    return (
        <ScrollView className="flex-1 bg-white">
            <StatusBar hidden={true} />
            <View className="h-screen justify-center items-center p-8">
                <View className="w-full flex flex-col items-center">
                    <Image source={require("../../assets/logo-only.png")} className="size-20 mb-10" />
                    <Text className="text-center text-3xl font-medium">Contact Info</Text>
                    <Text className="text-center mt-5 text-gray-500">We use contacts to help you to find friends who already use velochat. Your contacts stay private</Text>

                    <View className="my-8 flex-row items-center gap-2">
                        <CountryPicker
                            countryCode={countryCode}
                            withFilter
                            withFlag
                            withCountryNameButton
                            withCallingCode
                            visible={show}
                            onClose={() => {
                                setShow(false);
                            }}
                            onSelect={(item) => {
                                setCountryCode(item.cca2);
                                setCountry(item);
                                setShow(false);
                                setCallingCode(`+${item.callingCode[0]}`);
                            }}
                        />

                        <ChevronDown size={22} />
                    </View>

                    <View className="w-[85%] mt-2 flex-row gap-3">
                        <TextInput
                            inputMode="tel"
                            className="text-lg border-2 border-gray-500/70 rounded-xl mt-3 px-4 w-1/4 h-[50]"
                            placeholder="+94"
                            editable={false}
                            value={country ? `+${country.callingCode}` : `+94`}
                            onChangeText={(text) => {
                                setCallingCode(text);
                            }}
                        />

                        <TextInput
                            inputMode="tel"
                            className="text-lg border-2 border-gray-500/70 rounded-xl mt-3 px-4 w-3/4 h-[50]"
                            placeholder="77 ### ###"
                            onChangeText={(text) => {
                                setContactNo(text);
                            }}
                        />
                    </View>

                    <Pressable
                        className="w-full bg-indigo-600 p-3 mt-12 flex-row justify-center items-center rounded-lg gap-2"
                        onPress={async () => {
                            let validCallingCode = validateCountryCode(callingCode);
                            let validContactNo = validateContactNo(contactNo);

                            if (validCallingCode) { //+94
                                Toast.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: "Warning",
                                    textBody: validCallingCode
                                });
                                return;
                            }

                            if (validContactNo) {
                                Toast.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: "Warning",
                                    textBody: validContactNo
                                });
                                return;
                            }

                            setUserData((prev) => ({
                                ...prev,
                                countryCode: callingCode,
                                contactNo: contactNo
                            }));

                            //verify user
                            const res = await verifyUser(userData.countryCode, userData.contactNo);
                            if (res.status) {
                                navigation.navigate("VerifyScreen");
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
                    {
                        auth?.mode === "signUp" && (
                            <Pressable
                                className="w-full p-3 mt-5 flex-row justify-center items-center rounded-lg gap-2"
                                onPress={() => {
                                    navigation.goBack();
                                }}>
                                <Text className="text-lg text-indigo-600 font-semibold">Back</Text>
                            </Pressable>
                        )
                    }
                </View>
            </View>

            <BottomContent screenNo={2} />
        </ScrollView>
    )
}