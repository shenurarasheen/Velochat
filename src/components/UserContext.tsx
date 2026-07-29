import React, { createContext, ReactNode, useContext, useState } from "react";

export interface UserRegistrationData {
    fullName: string;
    email: string;
    contactNo: string;
    otp: string;
    countryCode: string;
    profileImage?: string | null;
}

interface UserRegistrationContextType {
    userData: UserRegistrationData,
    setUserData: React.Dispatch<React.SetStateAction<UserRegistrationData>>
}

const UserRegistrationContext = createContext<UserRegistrationContextType | undefined>(undefined);

export const UserRegistrationProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [userData, setUserData] = useState<UserRegistrationData>({
        fullName: "",
        email: "",
        contactNo: "",
        otp: "",
        countryCode: "",
        profileImage: null
    });

    return (
        <UserRegistrationContext.Provider value={{userData, setUserData}}>
            {children}
        </UserRegistrationContext.Provider>
    );
};

export const useUserRegistration = (): UserRegistrationContextType => {
    const ctx = useContext(UserRegistrationContext);
    if (!ctx) {
        throw new Error(
            "useUserRegistration must be used within a UserRegistrationProvider"
        );
    }
    return ctx;
}