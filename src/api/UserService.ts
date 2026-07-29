import { useContext } from "react";
import { UserRegistrationData } from "../components/UserContext";
import { AuthContext, AuthProvider } from "../components/AuthProvider";

const API = process.env.EXPO_PUBLIC_APP_URL + "/NexChat";

export const createAccount = async (userData: UserRegistrationData) => {
    const form = new FormData();
    form.append("fullname", userData.fullName);
    form.append("email", userData.email);
    form.append("countryCode", userData.countryCode);
    form.append("contactNo", userData.contactNo);
    form.append("profileImage", userData.profileImage ? {
        uri: userData.profileImage,
        name: "Profile.png",
        type: "image/png",
    } as any : null);

    const res = await fetch(API + "/UserController", {
        method: "POST",
        body: form
    });

    if (res.ok) {
        return await res.json();
    }

    return "OOPS! Account creation failed! :("
}

export const uploadProfileImage = async (userId: string, imageUri: string) => {
    const auth = useContext(AuthContext);
    let form = new FormData();
    form.append("userId", String(auth ? auth.userId : 0));
    form.append("profileImage", {
        uri: imageUri,
        type: "image/png",
        name: "profile.png"
    } as any);

    const res = await fetch(API + "/ProfileController", {
        method: "POST",
        body: form
    });

    if (res.ok) {
        return await res.json();
    } else {
        console.error("Profile image uploading failed!");
    }
}

export const verifyUser = async (code: string, number: string) => {

    const res = await fetch(API + "/VerifyUserController", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({code, number})
    });

    if (res.ok) {
        return await res.json();
    } else {
        console.error("Verification code sending failed. Please try again")
    }
}

export const sendEnteredOtp = async (code: string, number: string, otp: string, mode: string | undefined) => {
    const res = await fetch(API + "/VerifyUserController?countryCode=" + code + "&contactNo=" + number + "&otp=" + otp + "&mode=" + mode);

    if (res.ok) {
        return await res.json();
    } else {
        console.error("Verification failed. Please try again.");
    }
}