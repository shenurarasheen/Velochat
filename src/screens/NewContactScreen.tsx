import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { rootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { validateContactNo, validateCountryCode, validateFullName } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useSendNewContact } from "../socket/UseSendNewContact";

type NewContactScreenProps = NativeStackNavigationProp<rootStack, "NewContactScreen">

const NewContactScreen = () => {

    const navigation = useNavigation<NewContactScreenProps>();

    const [countryCode, setCountryCode] = useState<CountryCode>("LK");
    const [country, setCountry] = useState<Country | null>(null);
    const [show, setShow] = useState(false);

    const [callingCode, setCallingCode] = useState("+94");
    const [phoneNo, setPhoneNo] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const newContact = useSendNewContact();
    const sendNewContact = newContact.sendNewContact;
    const responseText = newContact.responseText;

    const sendData = () => {
        sendNewContact({
            id: 0,
            fullname: firstName + " " + lastName,
            countryCode: callingCode,
            contactNo: phoneNo,
            createdAt: "",
            updatedAt: "",
            status: ""
        })
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "",
            headerLeft: () => {
                return (
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                            className="justify-center items-center"
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back-sharp" size={24} color="black" />
                        </TouchableOpacity>
                        <View className="flex-col">
                            <Text className="text-lg font-semibold">New Contact</Text>
                        </View>
                    </View>
                )
            }
        })
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-4 gap-y-6">
                <View className="flex-row items-center gap-x-2">
                    <View className="flex-1 h-14 border-2 border-gray-400 rounded-lg flex-row gap-3 items-center px-3">
                        <Feather name="user" size={24} color="#9ca3af" />
                        <TextInput
                            placeholder="First name"
                            value={firstName}
                            onChangeText={(text) => {
                                setFirstName(text);
                            }}
                        />
                    </View>
                </View>
                <View className="flex-row items-center gap-x-2">
                    <View className="flex-1 h-14 border-2 border-gray-400 rounded-lg flex-row gap-3 items-center px-3">
                        <Feather name="user" size={24} color="#9ca3af" />
                        <TextInput
                            placeholder="Last name"
                            value={lastName}
                            onChangeText={(text) => {
                                setLastName(text);
                            }}
                        />
                    </View>
                </View>

                {/* counrty picker */}
                <View className="flex-row justify-center items-center h-14">
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
                        }}
                    />
                    <AntDesign name="caret-down" size={15} color="black" />
                </View>

                <View className="mt-2 flex-row items-center gap-x-2 w-full">
                    <View className="w-[25%] border-2 border-gray-400 rounded-lg flex-row items-center justify-center px-2 gap-3">
                        {/* <Feather name="phone" size={24} color="#9ca3af" /> */}
                        <TextInput
                        className="text-lg"
                            placeholder="+94"
                            editable={false}
                            value={country ? `+ ${country.callingCode}` : `+94`}
                            onChangeText={(text) => {
                                setCallingCode(text);
                            }}
                        />
                    </View>
                    <View className="flex-1 border-2 border-gray-400 rounded-lg px-3">
                        <TextInput 
                            className="text-lg"
                            placeholder="77 123 4567"
                            value={phoneNo}
                            onChangeText={(text) => {
                                setPhoneNo(text);
                            }}
                        />
                    </View>
                </View>

                <View className="mt-5">
                    <Pressable
                        className="bg-indigo-700 h-14 items-center justify-center rounded-xl"
                        onPress={() => {
                            const fullNameValid = validateFullName(firstName + " " + lastName);
                            const countryCodeValid = validateCountryCode(callingCode);
                            const contactNoValid = validateContactNo(phoneNo);

                            if (fullNameValid) {
                                Toast.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: "Warning",
                                    textBody: fullNameValid
                                });
                                return
                            }

                            if(countryCodeValid) {
                                Toast.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: "Warning",
                                    textBody: countryCodeValid
                                });
                                return;
                            }

                            if (contactNoValid) {
                                Toast.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: "Warning",
                                    textBody: contactNoValid
                                });
                                return;
                            }

                            sendData();
                        }}
                    >
                        <Text className="font-semibold text-lg text-slate-100">Save Contact</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default NewContactScreen;