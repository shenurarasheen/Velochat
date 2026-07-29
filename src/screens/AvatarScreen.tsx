import { Camera } from "lucide-react-native";
import { useContext, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import BottomContent from "../components/BottomContent";
import { useUserRegistration } from "../components/UserContext";
import { validateProfileImage } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { createAccount } from "../api/UserService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { rootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthProvider";

type AvatarScreenProps = NativeStackNavigationProp<rootStack, "AvatarScreen">

export default function AvatarScreen() {

    const navigation = useNavigation<AvatarScreenProps>();

    const { userData, setUserData } = useUserRegistration();
    const [image, setimage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!result.canceled) {
            setimage(result.assets[0].uri);
            setUserData((prev) => ({
                ...prev,
                profileImage: result.assets[0].uri
            }))
        }
    }

    const avatars = [
        require("../../assets/avatar/avatar_1.png"),
        require("../../assets/avatar/avatar_2.png"),
        require("../../assets/avatar/avatar_3.png"),
        require("../../assets/avatar/avatar_4.png"),
        require("../../assets/avatar/avatar_5.png"),
        require("../../assets/avatar/avatar_6.png")
    ]

    const auth = useContext(AuthContext);

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="h-screen mt-14 p-8">
                <View className="w-full flex-col items-center">
                    <Image source={require("../../assets/logo-only.png")} className="size-20 mb-10" />
                    <Text className="text-center text-3xl font-medium">Choose a Profile Image</Text>
                    <Text className="text-center mt-5 text-gray-500">Choose a Profile Image or select an Avatar for your account</Text>

                    <View className="relative mt-4">
                        {
                            image ? (
                                <Image source={{ uri: image }} className="size-32 rounded-full object-cover border-2 mt-5" />
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

                    <Text className="text-2xl font-semibold mt-4">{userData.fullName}</Text>

                    <View className="flex-row items-center my-8 px-4">
                        <View className="flex-1 h-[1.5] bg-[#ccc]"></View>
                        <Text className="mx-4 text-[#666]">OR</Text>
                        <View className="flex-1 h-[1.5] bg-[#ccc]"></View>
                    </View>

                    <Text className="text-xl mb-6 text-gray-500">Select an Avatar</Text>

                    <FlatList
                        data={avatars}
                        horizontal
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setimage(Image.resolveAssetSource(item).uri)
                                    setUserData((prev) => ({
                                        ...prev,
                                        profileImage: Image.resolveAssetSource(item).uri
                                    }))
                                }}
                            >
                                <Image
                                    source={item}
                                    className="h-20 w-20 rounded-full mx-2 border-2 border-gray-300"
                                />
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                        showsHorizontalScrollIndicator={false}
                    />

                    <Pressable
                        className="w-full bg-indigo-600 p-3 mt-12 flex-row justify-center items-center rounded-lg gap-2 disabled:bg-indigo-600/70"
                        disabled={loading}
                        onPress={
                            async () => {
                                const validProfileImage = validateProfileImage(
                                    userData.profileImage ?
                                        { uri: userData.profileImage, type: "", size: 0 } :
                                        null
                                );

                                if (validProfileImage) {
                                    Toast.show({
                                        type: ALERT_TYPE.WARNING,
                                        title: "Warning",
                                        textBody: validProfileImage
                                    })
                                    return;
                                }

                                setLoading(true);
                                try {
                                    const res = await createAccount(userData);
                                    if (res.status) {
                                        const id = res.userId;
                                        console.log(id);
                                        await auth?.signUp(String(id));
                                        //navigation.replace("HomeScreen");
                                        return;
                                    }
                                    Toast.show({
                                        type: ALERT_TYPE.WARNING,
                                        title: "Warning",
                                        textBody: res.message
                                    })

                                } catch (error) {
                                    console.error("Error from account creation", error);
                                } finally {
                                    setLoading(false);
                                }
                            }
                        }
                    >
                        {
                            loading && (
                                <ActivityIndicator size={20} color="white" />
                            )
                        }
                        <Text className="text-lg text-white font-semibold ml-1">
                            Create Account
                        </Text>
                    </Pressable>
                </View>
            </View>
            <BottomContent screenNo={4} />
        </ScrollView>
    )
}