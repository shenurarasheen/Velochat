import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
    userId: string | null;
    loading: boolean;
    mode: "signUp" | "signIn"
    signUp: (id: string) => Promise<void>
    signIn: (id: string) => Promise<void>
    signOut: () => Promise<void>
    changeMode: (mode: "signUp" | "signIn") => Promise<void>
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const USER_ID_KEY = "user_id" //saved name in async storage
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [mode, setMode] = useState<"signUp" | "signIn">("signUp");

    useEffect(() => {
        (async () => {
            try {
                const storedId = await AsyncStorage.getItem(USER_ID_KEY);
                setUserId(storedId);
            } catch (error) {
                console.error("Error restored userId", error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 4000);
            }
        })();
    }, []);

    const signUp = async (id: string) => {
        await AsyncStorage.setItem(USER_ID_KEY, id);
        setUserId(String(id));
    }

    const signIn = async (id: string) => {
        await AsyncStorage.setItem(USER_ID_KEY, id);
        setUserId(String(id));
    }

    const signOut = async () => {
        await AsyncStorage.removeItem(USER_ID_KEY);
        setUserId(null);
    }

    const changeMode = async (mode: "signIn" | "signUp") => {
        setMode(mode);
    }

    //when calling this hook if dependencies are changed otherwise it get previous data
    const value = useMemo(() => ({ userId, loading, mode, signUp, signIn, signOut, changeMode}), [userId, loading, mode]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}