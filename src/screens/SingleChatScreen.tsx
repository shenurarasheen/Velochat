import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { rootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, ImageBackground, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Feather, Fontisto, Ionicons } from "@expo/vector-icons";
import { Chat } from "../socket/Chat";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import useSingleChat from "../socket/UseSingleChat";
import { formatChatTime } from "../util/DateFormatter";
import { useSendChat } from "../socket/UseSendChat";

type Message = {
    id: number,
    text: string,
    sender: "me" | "friend",
    time: string,
    status: "sent" | "delivered" | "read"
}

type SingleChatScreenProps = NativeStackScreenProps<rootStack, "SingleChatScreen">

const SingleChatScreen = ({ route, navigation }: SingleChatScreenProps) => {

    const { chatId, friendName, lastSeenTime, profileImage } = route.params;
    const singleChat = useSingleChat(chatId);
    const allMessages = singleChat.messages;
    const sendMessage = useSendChat();
    const [newMessage, setNewMessage] = useState("");

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
                    <TouchableOpacity className="h-14 w-14 rounded-full border-1 border-gray-300 justify-center items-center">
                        <Image
                            source={{ uri: profileImage }}
                            className="h-14 w-14 rounded-full"
                        />
                    </TouchableOpacity>
                    <View className="space-y-2">
                        <Text className="text-xl font-semibold">{friendName}</Text>
                        <Text className="text-xs font-bold text-gray-500">last seen {lastSeenTime}</Text>
                    </View>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={24} color="black" />
                </TouchableOpacity>
            )
        })
    }, [navigation]);

    //render the chat bubles
    const renderItems = ({ item }: { item: Chat }) => {
        const isMe = item.from.id !== chatId;
        return (
            <View className={`my-2 px-3 max-w-[75%] p-2 ${isMe ? "self-end bg-indigo-600 rounded-tl-xl rounded-tr-xl rounded-bl-xl" : "self-start bg-white rounded-tl-xl rounded-tr-xl rounded-br-xl"}`}>
                <Text className={`${isMe ? "text-white" : "text-base"}`}>{item.message}</Text>
                <View className="flex-row justify-end items-center mt-1 gap-1">
                    <Text className={`${isMe ? " text-white text-xs" : "text-gray-500 text-xs"}`}>{formatChatTime(item.createdAt)}</Text>
                    {isMe && (
                        <Ionicons
                            name={
                                item.status === "READ" ?
                                    "checkmark-done-sharp"
                                    :
                                    item.status === "DELIVERED" ?
                                        "checkmark-done-sharp"
                                        :
                                        "checkmark"
                            }
                            size={16}
                            color={item.status === "READ" ? "#fff" : "#E8E9EB"}
                        />
                    )}
                </View>
            </View>
        )
    }

    const handleSendChat = () => {
        if (!newMessage.trim()) {
            return;
        }
        sendMessage(chatId, newMessage);
        setNewMessage("");
    }

    const ChatListHeader = () => {
        return (
            <>
                <View className="justify-center flex-1 mt-2">
                    <View className="justify-center items-center">
                        <Text className="bg-gray-400/40 p-1 px-3 text-sm text-gray-600 rounded-xl mt-5">September 5, 2025</Text>
                    </View>

                    <View className="justify-center items-center mb-6">
                        <Text className="bg-gray-400/40 max-w-[80%] py-2 px-3 text-sm text-gray-600 rounded-xl mt-5 text-center">
                            <Feather name="lock" size={13} color="gray"
                            />  Messages and Calls are end-to-end encrypted. Only people in this chat can read or share them. Learn more.
                        </Text>
                    </View>
                </View>
            </>
        )
    }

    return (
        <SafeAreaView className="flex-1">
            <ImageBackground
                source={require("../../assets/wtsapp-bg.png")}
                className="flex-1 mt-[-50] mb-[-50]" resizeMode="cover"
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "android" ? "padding" : "height"}
                    className="px-3 flex-1"
                    keyboardVerticalOffset={50}
                >



                    {/* Flatlist here */}

                    <FlatList
                        data={allMessages}
                        renderItem={renderItems}
                        className="px-3 flex-1"
                        keyExtractor={(_, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListHeaderComponent={ChatListHeader}
                    >
                    </FlatList>

                    {/* Flatlist here */}

                    <View className="flex-row items-end bg-transparent gap-2 pb-[60]">
                        <View className="flex-row flex-1 max-h-32 px-5 py-1 bg-gray-200 rounded-full items-center gap-2">
                            <TextInput
                                className="flex-1 placeholder:text-lg"
                                multiline
                                keyboardType="default"
                                placeholder="Message"
                                value={newMessage}
                                onChangeText={(text) => {
                                    setNewMessage(text);
                                }}
                            />
                            <Fontisto name="paperclip" size={24} color="gray" />
                            <Feather name="camera" size={24} color="gray" className="ms-2" />
                        </View>
                        <TouchableOpacity
                            className="bg-indigo-600 w-14 h-14 rounded-full items-center justify-center"
                            onPress={handleSendChat}
                        >
                            <Ionicons name="send" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </SafeAreaView>
    )
}

export default SingleChatScreen;