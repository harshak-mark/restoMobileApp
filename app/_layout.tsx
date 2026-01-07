import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ColorSchemeName } from 'react-native';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { persistor, store } from '../src/store/store';
import { ThemeProvider as AppThemeProvider } from '../src/theme/ThemeContext';

import {
    Epilogue_400Regular,
    Epilogue_500Medium,
} from '@expo-google-fonts/epilogue';
import {
    FredokaOne_400Regular,
} from '@expo-google-fonts/fredoka-one';
import {
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
    PlayfairDisplay_400Regular,
} from '@expo-google-fonts/playfair-display';

const AppNavigation = ({ colorScheme }: { colorScheme: ColorSchemeName | null }) => {
  const navTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const statusBarStyle = colorScheme === 'dark' ? 'light' : 'dark';

  return (
    <NavigationThemeProvider value={navTheme || (colorScheme === 'dark' ? DarkTheme : DefaultTheme)}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="landing" />
        <Stack.Screen name="login" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="home" />
        <Stack.Screen name="menu" />
        <Stack.Screen name="biriyani" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="settings/personalinfo" />
        <Stack.Screen name="settings/personalinfo/editdetails" />
        <Stack.Screen name="settings/account" />
        <Stack.Screen name="settings/delivery-address" />
        <Stack.Screen name="settings/delivery-address/add" />
        <Stack.Screen name="settings/payment" />
        <Stack.Screen name="settings/payment/upi" />
        <Stack.Screen name="settings/payment/card" />
        <Stack.Screen name="contact" />
      </Stack>

      <StatusBar style={statusBarStyle || (colorScheme === 'dark' ? 'light' : 'dark')} />
    </NavigationThemeProvider>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    FredokaOne_400Regular,
    Epilogue_400Regular,
    Epilogue_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppThemeProvider>
          <AppNavigation colorScheme={colorScheme} />
        </AppThemeProvider>
      </PersistGate>
    </Provider>
  );
}