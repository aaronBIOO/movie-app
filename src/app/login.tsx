import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { signInWithGoogle } from "@/services/supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = ({
  message = "Sign in to get started",
  showGuestOption = true
}: {
  message?: string;
  showGuestOption?: boolean
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      router.replace("/(tabs)");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className={`bg-primary flex-1 ${showGuestOption ? 'h-full' : ''}`}>
      <Image
        source={images.bg}
        className="w-full h-full absolute z-0"
        resizeMode="cover"
      />

      <View className="flex-1 px-10 justify-start pt-40 items-center">
        <Image
          source={icons.logo}
          className="w-20 h-16 mb-10"
          resizeMode="contain"
        />

        <Text className="text-white text-3xl font-bold text-center mb-2">
          Welcome to Go Movies
        </Text>
        <Text className="text-gray-400 text-lg text-center mb-1">
          Your personal movie companion.
        </Text>

        <Text className="text-accent text-md text-center mb-10">
          {message}
        </Text>

        <TouchableOpacity
          onPress={handleGoogleSignIn}
          disabled={loading}
          className="bg-white flex-row items-center justify-center py-4 px-8 rounded-full w-[60%]"
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="text-primary font-bold text-lg">
              Sign in with Google
            </Text>
          )}
        </TouchableOpacity>

        {showGuestOption && (
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            className="mt-8"
          >
            <Text className="text-gray-400 text-base">
              Continue as Guest
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Login;
