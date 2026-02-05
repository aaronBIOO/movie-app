import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

import { fetchMovies } from "@/services/api";
import { getTrendingMovies, updateSearchCount } from "@/services/supabase";
import useFetch from "@/services/use-fetch";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import MovieCard from "@/components/movie-card";
import SearchBar from "@/components/search-bar";
import TrendingCard from "@/components/trending-card";

const Index = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: loadMovies,
    reset: resetMovies,
  } = useFetch(() => fetchMovies({ query: searchQuery }), searchQuery === "");

  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
    refetch: loadSearchResults,
    reset: resetSearchResults,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        const results = await loadSearchResults() as Movie[];

        // Potential check for analytics if results exist
        if (results && results.length > 0) {
          await updateSearchCount(searchQuery, results[0]);
        }
      } else {
        resetSearchResults();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const isLoading = trendingLoading || moviesLoading || searchLoading;
  const error = trendingError || moviesError || searchError;

  return (
    <View className="flex-1 bg-primary">
      {/* Background image */}
      <Image
        source={images.bg}
        className="w-full h-full absolute z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        {/* header icon */}
        <Image
          source={icons.logo}
          className="w-12 h-10 mt-20 mb-5 mx-auto"
        />

        {/* search bar */}
        <View className="my-5">
          <SearchBar
            placeholder="Search for a movie"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            className={"flex-row items-center bg-dark-200 rounded-full px-5 py-4 w-[350px] h-[60px] mx-auto"}
          />
        </View>

        {/* loading state and error check */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : error ? (
          <Text className="text-white">
            Error: {error.message}
          </Text>
        ) : (
          <View className="flex-1 mt-5">

            {!searchQuery.trim() ? (
              <>
                {/* trending movies */}
                {trendingMovies && trendingMovies.length > 0 && (
                  <View className="mb-10">
                    <Text className="text-lg text-white font-bold mb-3">
                      Trending Movies
                    </Text>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="mb-4 mt-3"
                      data={trendingMovies}
                      contentContainerStyle={{
                        gap: 26,
                      }}
                      renderItem={({ item, index }) => (
                        <TrendingCard movie={item} index={index} />
                      )}
                      keyExtractor={(item) => item.movie_id.toString()}
                      ItemSeparatorComponent={() => <View className="w-4" />}
                    />
                  </View>
                )}

                {/* latest movies */}
                <>
                  <Text className="text-lg text-white font-bold mt-5 mb-3 ml-4">
                    Latest Movies
                  </Text>

                  <FlatList
                    data={movies}
                    renderItem={({ item }) => (
                      <MovieCard
                        {...item}
                      />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{
                      justifyContent: "flex-start",
                      gap: 20,
                      paddingRight: 5,
                      marginBottom: 10,
                    }}
                    className="mt-2 pb-32"
                    scrollEnabled={false}
                  />
                </>
              </>
            ) : (
              <>
                <Text className="text-xl text-white font-bold mb-5">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>

                <FlatList
                  data={searchResults}
                  renderItem={({ item }) => (
                    <MovieCard
                      {...item}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10,
                  }}
                  className="mt-2 pb-32"
                  scrollEnabled={false}
                  ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-10">
                      No movies found for "{searchQuery}"
                    </Text>
                  }
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default Index;
