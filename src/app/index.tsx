import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold text-accent mb-4">
        Welcome here!
      </Text>

      <View className="flex flex-col gap-2 text-center justify-center items-center">
        <Link href="/onboarding">onboarding</Link>
        <Link href={{ pathname: "/movie/[id]", params: { id: "avengers" } }}>Avengers movie</Link>
      </View>
    </View>
  );
}
