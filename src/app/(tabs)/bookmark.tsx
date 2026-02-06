import MovieCard from "@/components/movie-card";
import { icons } from "@/constants/icons";
import { useAuth } from "@/context/AuthContext";
import { getUserBookmarks } from "@/services/supabase";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Login from "../login";

const Bookmark = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (user) {
        setLoading(true);
        const data = await getUserBookmarks();
        setBookmarks(data || []);
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  if (authLoading) return null;

  if (!user) {
    return <Login message="Sign in to view bookmarks" showGuestOption={false} />;
  }

  return (
    <SafeAreaView className="bg-primary flex-1 px-10">
      <View className="mt-10 mb-5">
        <Text className="text-white text-3xl font-bold">Bookmarks</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#AB8BFF" className="mt-10" />
      ) : bookmarks.length > 0 ? (
        <FlatList
          data={bookmarks}
          renderItem={({ item }) => (
            <MovieCard
              id={item.movie_id}
              title={item.title}
              poster_path={item.poster_url?.replace("https://image.tmdb.org/t/p/w500", "")}
              vote_average={0} // We might want to store/fetch this too if needed
              release_date=""
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 20,
            marginBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg ">No bookmarks yet</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Bookmark;