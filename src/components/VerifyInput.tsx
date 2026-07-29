import { useRef, useState } from "react";
import { TextInput } from "react-native";
import { useUserRegistration } from "./UserContext";

export default function VerifyInput() {

    const { userData, setUserData } = useUserRegistration();

    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const inputRefs = useRef<TextInput[]>([]);

    //move forward
    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        setUserData((prev) => ({
            ...prev,
            otp: newOtp.join('').trim()
        }))

        if (text && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    //move backward
    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && index > 0) {
            const newOtp = [...otp];
            if (otp[index] === "") {
                inputRefs.current[index - 1]?.focus();
                newOtp[index] = ""
                setOtp(newOtp);
                setUserData((prev) => ({
                    ...prev,
                    otp: newOtp.join('').trim()
                }))
            } else {
                newOtp[index] = "";
                setOtp(newOtp);
                setUserData((prev) => ({
                    ...prev,
                    otp: newOtp.join('').trim()
                }))
            }
        }
    }

    return (
        <>
            {
                otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(el) => {
                            if (el) inputRefs.current[index] = el
                        }}
                        inputMode="numeric"
                        className="text-2xl border-2 border-gray-500/70 rounded-xl px-4 h-[50] w-1/5 text-center flex items-center"
                        maxLength={1}
                        keyboardType="number-pad"
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        autoFocus={index === 0}
                    />
                ))
            }
        </>

    )
}