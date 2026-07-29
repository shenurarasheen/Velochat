import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import './global.css';
import { ThemeProvider } from './src/theme/ThemeProvide';
import SignUpScreen from './src/screens/SignUpScreen';
import ContactScreen from './src/screens/ContactScreen';
import AvatarScreen from './src/screens/AvatarScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import VerificationSuccessScreen from './src/screens/VerificationSuccessScreen';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { UserRegistrationProvider } from './src/components/UserContext';
import HomeScreen from './src/screens/HomeScreen';
import StatusScreen from './src/screens/StatusScreen';
import CallsScreen from './src/screens/CallsScreen';
import HomeTabs from './src/screens/HomeTabs';
import SingleChatScreen from './src/screens/SingleChatScreen';
import { WebSocketProvider } from './src/socket/WebSocketProvider';
import NewChatScreen from './src/screens/NewChatScreen';
import NewContactScreen from './src/screens/NewContactScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './src/components/AuthProvider';

export type rootStack = {
  SplashScreen: undefined,
  SignUpScreen: undefined,
  ContactScreen: undefined,
  VerifyScreen: undefined,
  VerificationSuccessScreen: undefined,
  AvatarScreen: undefined,
  HomeScreen: undefined,
  ChatScreen: undefined,
  StatusScreen: undefined,
  CallsScreen: undefined,
  SingleChatScreen: {
    chatId: number,
    friendName: string,
    lastSeenTime: string,
    profileImage: string
  },
  NewChatScreen: undefined,
  NewContactScreen: undefined,
  ProfileScreen: undefined
}

const Stack = createNativeStackNavigator<rootStack>();

const ChatApp = () => {
  const auth = useContext(AuthContext);

  return (
    <WebSocketProvider userId={Number(auth?.userId)}>
      <ThemeProvider>
        <UserRegistrationProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName='SplashScreen'>

              {
                auth?.loading ? (
                  <Stack.Screen name='SplashScreen' component={SplashScreen} options={{ headerShown: false }}></Stack.Screen>
                ) : auth?.userId === null ? (
                  auth.mode === "signIn" ? (
                    <Stack.Group>
                      <Stack.Screen name='ContactScreen' component={ContactScreen} options={{ headerShown: false }}></Stack.Screen>
                      <Stack.Screen name='VerifyScreen' component={VerifyScreen} options={{ headerShown: false }}></Stack.Screen>
                    </Stack.Group>
                  ) : (
                    <Stack.Group>
                      <Stack.Screen name='SignUpScreen' component={SignUpScreen} options={{ headerShown: false }}></Stack.Screen>
                      <Stack.Screen name='ContactScreen' component={ContactScreen} options={{ headerShown: false }}></Stack.Screen>
                      <Stack.Screen name='VerifyScreen' component={VerifyScreen} options={{ headerShown: false }}></Stack.Screen>
                      <Stack.Screen name='VerificationSuccessScreen' component={VerificationSuccessScreen} options={{ headerShown: false }}></Stack.Screen>
                      <Stack.Screen name='AvatarScreen' component={AvatarScreen} options={{ headerShown: false }}></Stack.Screen>
                    </Stack.Group>
                  )
                ) : (
                  <Stack.Group>
                    <Stack.Screen name='HomeScreen' component={HomeTabs} options={{ headerShown: false }}></Stack.Screen>
                    <Stack.Screen name='StatusScreen' component={StatusScreen}></Stack.Screen>
                    <Stack.Screen name='CallsScreen' component={CallsScreen}></Stack.Screen>
                    <Stack.Screen name='SingleChatScreen' component={SingleChatScreen}></Stack.Screen>
                    <Stack.Screen name='NewChatScreen' component={NewChatScreen}></Stack.Screen>
                    <Stack.Screen name='NewContactScreen' component={NewContactScreen}></Stack.Screen>
                    <Stack.Screen name='ProfileScreen' component={ProfileScreen}></Stack.Screen>
                  </Stack.Group>
                )
              }

            </Stack.Navigator>
          </NavigationContainer>
        </UserRegistrationProvider>
      </ThemeProvider>
    </WebSocketProvider>
  )
}

export default function App() {

  return (
    <AlertNotificationRoot>
      <AuthProvider>
        <ChatApp />
      </AuthProvider>
    </AlertNotificationRoot>
  );
}

