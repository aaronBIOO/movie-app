import { Image, ScrollView, View } from "react-native";
import { Link } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

export default function Index() {
  return (
    <View className="flex-1 items-center bg-primary justify-center">
      <Image source={images.bg} className="w-full absolute z-0" />

      <ScrollView 
        className="flex-1 px-5" 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        
      </ScrollView>
    </View>
  );
}
