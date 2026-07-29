import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { rootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { FriendList, User } from "../socket/Chat";
import { useFriendList } from "../socket/FriendsList";
import { formatChatTime } from "../util/DateFormatter";

type NewChatScreenProps = NativeStackNavigationProp<rootStack, "NewChatScreen">

const NewChatScreen = () => {

    const navigation = useNavigation<NewChatScreenProps>();
    const [search, setSearch] = useState("");
    const friends = useFriendList();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "",
            headerLeft: () => (
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                        className="justify-center items-center"
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back-sharp" size={24} color="black" />
                    </TouchableOpacity>
                    <View className="flex-col">
                        <Text className="text-xl font-semibold">Select Contacts</Text>
                        <Text className="text-sm text-gray-500 font-semibold">{friends.length} Contacts</Text>
                    </View>
                </View>
            )
        });
    }, [navigation, friends])

    const renderItem = ({ item }: { item: User }) => {
        return (
            <TouchableOpacity
                className="justify-start items-center gap-x-3 px-3 py-2 flex-row mt-1"
                onPress={() => {
                    navigation.replace("SingleChatScreen", {
                        chatId: item.id,
                        friendName: `${item.fullname}`,
                        lastSeenTime: formatChatTime(item.updatedAt),
                        profileImage: item.profileImage
                            ? item.profileImage
                            : `https://ui-avatars.com/api/?name=${item.fullname.replace(" ", "+")}&background=random`
                    })
                }}
            >
                <View>
                    <TouchableOpacity className="h-14 w-14 rounded-full border-1 border-gray-300 justify-center items-center">
                        {
                            item.profileImage ? (
                                <Image
                                    source={{ uri: item.profileImage }}
                                    className="h-14 w-14 rounded-full"
                                />
                            ) : (
                                <Image
                                    source={
                                        {
                                            uri: `https://ui-avatars.com/api/?name=${item.fullname.replace(" ", "+")}&background=random`
                                        }
                                    }
                                    className="h-14 w-14 rounded-full"
                                />
                            )
                        }
                    </TouchableOpacity>
                </View>
                <View className="flex-col gap-y-1">
                    <Text className="font-semibold text-lg">{item.fullname}</Text>
                    <Text className="font-semibold text-gray-500 text-sm">{item.status === "ACTIVE" ? "Already in FriendList, Message Now" : "Hey there! I am using Velochat"}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const filterFriends = [...friends].filter((friend) =>{
        return (
            friend.fullname.toLowerCase().includes(search.toLowerCase()) ||
            friend.contactNo.toLowerCase().includes(search.toLowerCase())
        );
    }).sort((a, b) => a.fullname.localeCompare(b.fullname));

    return (
        <SafeAreaView className="flex-1 bg-white px-4" edges={["bottom", "left", "right"]}>
            <View className="flex-1">
                <View className="items-center flex-row border-gray-300 border-2 rounded-full px-4 h-14 mt-5">
                    <Ionicons name="search" size={24} color="gray" />
                    <TextInput
                        className="flex-1 text-base ps-5"
                        placeholder="Search"
                        value={search}
                        onChangeText={(text) => {
                            setSearch(text);
                        }}
                    />
                </View>
                <View className="px-2 my-2 bg-gray-300/40 rounded-xl py-2 mt-4 mb-4">
                    <TouchableOpacity
                        className="flex-row items-center justify-center gap-x-5 p-2"
                        onPress={() => navigation.navigate("NewContactScreen")}
                    >
                        <Feather name="user-plus" size={24} color="#0284c7" />
                        <Text className="text-md font-semibold text-sky-600">Create new contact</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {/* contact */}
                    {
                        friends.length === 0 ? (
                            <View className="w-full justify-center items-center mt-6">
                                 <AntDesign name="usergroup-add" size={100} color="#9ca3af" />
                                 <Text className="text-md text-gray-400 mt-4">Add your friends to the app for start chat</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={filterFriends}
                                renderItem={renderItem}
                                keyExtractor={(_, index) => index.toString()}
                            />
                        )
                    }
                    {/* contact */}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default NewChatScreen;