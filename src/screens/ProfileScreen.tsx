import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context"
import { rootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, Text, View } from "react-native";
import { Camera } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';
import { Feather, Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../components/AuthProvider";
import { uploadProfileImage } from "../api/UserService";
import { useUserProfile } from "../socket/UseMyProfile";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

type ProfileScreenProps = NativeStackNavigationProp<rootStack, "ProfileScreen">

const ProfileScreen = () => {

    const navigation = useNavigation<ProfileScreenProps>();
    const [ image, setImage ] = useState<string| null>(null);
    const { sendProfile, userProfile } = useUserProfile();
    const auth = useContext(AuthContext);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "My Profile",
        })
    }, [navigation]);

    const pickImage =  async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            uploadProfileImage(String(auth ? auth.userId : 0), result.assets[0].uri);
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-center bg-white">
            <View className="flex-1 w-full px-5">
                <View className="flex-row justify-center">
                    <View className="relative mt-2">
                        {
                            image ? (
                                <Image source={{ uri: image }} className="size-32 rounded-full object-cover border-2" />
                            ) : userProfile?.profileImage ? (
                                <Image source={{uri: userProfile.profileImage}} className="size-32 rounded-full object-cover border-2 mt-5" />
                            ) : (
                                <Image source={require("../../assets/avatar.png")} className="size-32 rounded-full object-cover border-2 mt-5" />
                            )
                        }
                        <Pressable
                            className="absolute bottom-0 right-0 p-2 rounded-full cursor pointer transition-all duration-200 bg-gray-200"
                            onPress={pickImage}
                        >
                            <Camera className="w-5 h-5 text-base" />
                        </Pressable>
                    </View>
                </View>
                <View className="w-full bg-gray-400/20 flex-col items-center p-4 px-6 mt-12 rounded-lg">
                    <View className="flex-row gap-6 items-center justify-start">
                        <Feather name="user" size={24} color="black" />
                        <View className="flex-column items-start flex-1">
                            <Text className="text-xl font-semibold">Profile Name</Text>
                            <Text className="text-lg font-lg text-gray-600">{userProfile?.fullname}</Text>
                        </View>
                    </View>
                </View>

                <View className="w-full bg-gray-400/20 flex-col items-center p-4 px-6 mt-2 rounded-lg">
                    <View className="flex-row gap-6 items-center justify-start">
                        <Feather name="mail" size={24} color="black" />
                        <View className="flex-column items-start flex-1">
                            <Text className="text-xl font-semibold">Email Address</Text>
                            <Text className="text-lg font-lg text-gray-600">{userProfile?.email}</Text>
                        </View>
                    </View>
                </View>

                <View className="w-full bg-gray-400/20 flex-col items-center p-4 px-6 mt-2 rounded-lg">
                    <View className="flex-row gap-6 items-center justify-start">
                        <Feather name="phone" size={24} color="black" />
                        <View className="flex-column items-start flex-1">
                            <Text className="text-xl font-semibold">Mobile Number</Text>
                            <Text className="text-lg font-lg text-gray-600">{userProfile?.countryCode + " " + userProfile?.contactNo}</Text>
                        </View>
                    </View>
                </View>

                <Pressable 
                className="bg-indigo-600 h-16 mt-10 rounded-xl justify-center items-center"
                onPress={
                    () => {
                        if (image === null) {
                            Toast.show({
                                type: ALERT_TYPE.WARNING,
                                title: "Warning",
                                textBody: "Profile Image can not be empty"
                            });
                            return;
                        }                       
                        sendProfile(image);
                    }
                }
                >
                    <Text className="text-white font-semibold text-lg">Save Changes</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default ProfileScreen;