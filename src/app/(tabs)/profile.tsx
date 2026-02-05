import { icons } from "@/constants/icons";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/services/supabase";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/login" as any);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) return null;

  return (
    <SafeAreaView className="bg-primary flex-1 px-10">
      <View className="flex justify-center items-center flex-1 flex-col gap-6">
        {user ? (
          <>
            <View className="items-center">
              <Image
                source={{ uri: user.user_metadata.avatar_url || icons.person }}
                className="size-24 rounded-full border-2 border-accent"
              />
              <Text className="text-white text-2xl font-bold mt-4">
                {user.user_metadata.full_name || "User"}
              </Text>
              <Text className="text-gray-400 text-base">
                {user.email}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSignOut}
              className="bg-red-500 py-3 px-10 rounded-full mt-10"
            >
              <Text className="text-white font-bold">Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Image source={icons.person} className="size-20" tintColor="#fff" />
            <Text className="text-white text-xl font-bold">You are not logged in</Text>
            <TouchableOpacity
              onPress={() => router.push("/login" as any)}
              className="bg-accent py-3 px-10 rounded-full mt-4"
            >
              <Text className="text-primary font-bold">Sign In</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Profile;