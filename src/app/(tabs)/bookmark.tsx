import { icons } from "@/constants/icons";
import { useAuth } from "@/context/AuthContext";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Login from "../login";

const Bookmark = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Login message="Sign in to view bookmarks" showGuestOption={false} />;
  }

  return (
    <SafeAreaView className="bg-primary flex-1 px-10">
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
        <Image source={icons.save} className="size-10" tintColor="#fff" />
        <Text className="text-gray-500 text-base">Save</Text>
      </View>
    </SafeAreaView>
  );
};

export default Bookmark;