import { icons } from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  className?: string;
}

const SearchBar = ({ placeholder, value, onChangeText, onPress, className }: Props) => {
  return (
    <View className={className}>
      <Image
        source={icons.search}
        className="w-5 h-5"
        resizeMode="contain"
        tintColor="#AB8BFF"
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        className="flex-1 ml-2 text-white"
        placeholderTextColor="#A8B5DB"
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText?.("")}>
          <Ionicons name="close-circle" size={20} color="#A8B5DB" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SearchBar;
