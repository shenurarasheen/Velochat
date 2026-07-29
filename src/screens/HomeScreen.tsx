import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { rootStack } from "../../App";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useContext, useLayoutEffect, useState } from "react";
import { FlatList, Image, Modal, Pressable, Text, TextInput, Touchable, TouchableOpacity, View } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Chat } from "../socket/Chat";
import { chats } from "../util/ChatData";
import { useChatList } from "../socket/UseChatList";
import { formatChatTime } from "../util/DateFormatter";
import { AuthContext } from "../components/AuthProvider";

type HomeScreenProps = NativeStackNavigationProp<rootStack, "HomeScreen">

export default function HomeScreen() {

    const navigation = useNavigation<HomeScreenProps>();
    const [search, setSearch] = useState("");
    const [isModalVisible, setIsModelisible] = useState(false);
    const chatList = useChatList();
    const auth = useContext(AuthContext);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerRight: () => (
                <View className="flex-row space-x-4">
                    <TouchableOpacity className="me-5">
                        <Ionicons name="camera" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsModelisible(true)}>
                        <Ionicons name="ellipsis-vertical" size={24} color="black" />
                    </TouchableOpacity>
                    <Modal
                        animationType="fade"
                        visible={isModalVisible}
                        transparent={true}
                        onRequestClose={() => setIsModelisible(false)}
                    >
                        <Pressable className="flex-1 bg-transparent" onPress={() => setIsModelisible(false)}>
                            <Pressable
                                onPress={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <View className="justify-end items-end p-5">
                                    <View
                                        className="bg-white rounded-md w-72 p-3"
                                        style={{
                                            shadowColor: "#000",
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            elevation: 5
                                        }}
                                    >
                                        <TouchableOpacity
                                            className="h-10 my-1 justify-center items-start"
                                            onPress={() => {
                                                setIsModelisible(false);
                                            }}
                                        >
                                            <Text className="font-semibold text-lg">Settings</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="h-10 my-1 justify-center items-start"
                                            onPress={() => {
                                                navigation.navigate("ProfileScreen");
                                            }}
                                        >
                                            <Text className="font-semibold text-lg">My Profile</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="h-10 my-1 justify-center items-start"
                                            onPress={
                                                async () => {
                                                    await auth?.signOut();                                       
                                                }

                                            }
                                        >
                                            <Text className="font-semibold text-lg">Logout</Text>
                                        </TouchableOpacity>

                                        {/* <TouchableOpacity
                                            className="h-10 my-2 justify-center items-start border-b-2 border-b-gray-100"
                                            onPress={
                                                async () => {
                                                    await auth?.signOut();
                                                    auth?.changeMode("signIn");                                       
                                                }

                                            }
                                        >
                                            <Text className="font-semibold text-lg">Sign In</Text>
                                        </TouchableOpacity> */}
                                    </View>
                                </View>
                            </Pressable>
                        </Pressable>
                    </Modal>
                </View>
            ),
            headerLeft: () => (
                <Image source={require("../../assets/logo-zoom.png")} className="w-[150] h-[30]" />
            )
        })
    }, [navigation, isModalVisible]);

    const filterdChats = [...chatList].filter(chat => {
        return (
            chat.friendName.toLowerCase().includes(search.toLowerCase()) ||
            chat.lastMessage.toLowerCase().includes(search.toLowerCase())
        )
    }).sort((a, b) => new Date(b.lastTimeStamp).getTime() - new Date(a.lastTimeStamp).getTime());

    const renderItems = ({ item }: { item: Chat }) => (
        <TouchableOpacity
            className="flex-row items-center py-2 px-2 my-1 h-20"
            onPress={() => navigation.navigate("SingleChatScreen", {
                chatId: item.friendId,
                friendName: item.friendName,
                lastSeenTime: formatChatTime(item.lastTimeStamp),
                profileImage: item.profileImage ? item.profileImage : `https://ui-avatars.com/api/?name=${item.friendName.replace(" ", "+")}&background=random`
            })}
        >
            <TouchableOpacity className="h-14 w-14 rounded-full border-1 border-gray-300 justify-center items-center">
                {
                    item.profileImage ? (
                        <Image
                            source={{ uri: item.profileImage }}
                            className="h-14 w-14 rounded-full"
                        />
                    ) : (
                        <Image
                            source={{
                                uri: `https://ui-avatars.com/api/?name=${item.friendName.replace(" ", "+")}&background=random`
                            }}
                            className="h-14 w-14 rounded-full"
                        />
                    )
                }

            </TouchableOpacity>
            <View className="flex-1 ms-3">
                <View className="flex-row justify-between items-center">
                    <Text className="font-bold text-lg text-slate-700" numberOfLines={1} ellipsizeMode="tail">{item.friendName}</Text>
                    <Text className="font-bold text-xs text-gray-500">{formatChatTime(item.lastTimeStamp)}</Text>
                </View>
                <View className="flex-row justify-between items-center mt-1">
                    <Text
                        className="text-gray-500 flex-1 text-base"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item.lastMessage}
                    </Text>

                    {
                        item.unreadCount > 0 && (
                            <View className="bg-indigo-600 w-5 h-5 ms-3 rounded-full justify-center items-center">
                                <Text className="text-slate-50 text-sm">{item.unreadCount}</Text>
                            </View>
                        )
                    }

                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView className="flex-1 px-3 bg-white" edges={["right", "bottom", "left"]}>
            <View className="items-center flex-row mx-2 border-gray-300 border-2 rounded-full px-3 h-14 mt-5">
                <Ionicons name="search" size={24} color="gray" />
                <TextInput
                    className="flex-1 text-base ps-5"
                    placeholder="Search"
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                />
            </View>
            <View className="mt-2">
                {
                    chatList.length === 0 ? (
                        <View className="mt-28 items-center w-full">
                            <Entypo name="chat" size={100} color="#9ca3af" />
                            <Text className="text-md text-gray-500 text-center mt-10">Start chat with friends by Clicking on the chat button bellow</Text>
                        </View>
                    ) : (
                        <FlatList data={filterdChats} renderItem={renderItems} />
                    )
                }
            </View>
            <View className="absolute bg-indigo-600 h-[65] w-[65] rounded-3xl right-7 bottom-20">
                <TouchableOpacity
                    className="h-[65] w-[65] rounded-3xl justify-center items-center"
                    onPress={() => navigation.navigate("NewChatScreen")}
                >
                    <Ionicons name="chatbox-ellipses" size={26} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}