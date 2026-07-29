import { Text, View } from "react-native";

const screenCount = 4;

export default function BottomContent({ screenNo }: { screenNo: number }) {

    return (
        <View className="absolute w-full bottom-10">
            <View className="flex-row justify-center w-full">
                {
                    [...Array(screenCount)].map((_, index) => (

                        <View
                            key={index}
                            className={`size-3.5 rounded-full mx-2 ${index === (screenNo - 1) ? 'bg-indigo-500' : 'bg-gray-300'
                                }`}
                        >
                        </View>
                    ))
                }

            </View>
            <Text className="mt-16 text-center text-xs text-gray-500">Copy Right 2025 Velochat. All right reserved.</Text>
        </View>
    )
}