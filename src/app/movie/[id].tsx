import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { icons } from '@/constants/icons';
import { fetchMovieDetails } from '@/services/api';
import useFetch from '@/services/use-fetch';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const POSTER_HEIGHT = 500;
const TAB_BAR_HEIGHT = 70 + 36 + 20;

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Gesture state for Modal
  const modalScale = useSharedValue(1);
  const modalTranslateY = useSharedValue(0);
  const modalOpacity = useSharedValue(1);

  const {
    data: movie,
    loading,
    error,
  } = useFetch(() => fetchMovieDetails(id as string));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const posterAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, POSTER_HEIGHT],
            [0, -POSTER_HEIGHT * 0.3], // Move up slightly
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-POSTER_HEIGHT, 0],
            [2, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 50], [1, 0], Extrapolation.CLAMP),
    };
  });

  // Limit how far the card covers the poster (e.g., stop 150px from top)
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, POSTER_HEIGHT],
            [0, -POSTER_HEIGHT * 0.1], // Partial cover
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  // Modal gesture logic
  const closeModal = () => {
    setIsModalVisible(false);
    modalTranslateY.value = 0;
    modalScale.value = 1;
    modalOpacity.value = 1;
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        modalTranslateY.value = event.translationY;
        const scale = interpolate(event.translationY, [0, 300], [1, 0.8], Extrapolation.CLAMP);
        modalScale.value = scale;
        modalOpacity.value = interpolate(event.translationY, [0, 300], [1, 0.5], Extrapolation.CLAMP);
      }
    })
    .onEnd((event) => {
      if (event.translationY > 150 || event.velocityY > 1000) {
        modalTranslateY.value = withTiming(SCREEN_HEIGHT, {}, () => {
          runOnJS(closeModal)();
        });
      } else {
        modalTranslateY.value = withTiming(0);
        modalScale.value = withTiming(1);
        modalOpacity.value = withTiming(1);
      }
    });

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: modalTranslateY.value },
      { scale: modalScale.value }
    ],
    opacity: modalOpacity.value,
  }));

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View className="flex-1 bg-primary justify-center items-center px-5">
        <Text className="text-white text-lg text-center">
          {error?.message || "Failed to load movie details"}
        </Text>
        <TouchableOpacity
          className="mt-5 bg-accent px-6 py-3 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-primary font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      {/* Animated Poster Background */}
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', top: 0, left: 0, right: 0, height: POSTER_HEIGHT, zIndex: 0 }, posterAnimatedStyle]}
      >
        <Image
          source={{
            uri: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </Animated.View>

      {/* Static Header Buttons (Fade out on scroll) */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }, headerAnimatedStyle]}>
        <SafeAreaView className="flex-row justify-between px-5 py-2">
          <TouchableOpacity
            className="bg-dark-200/80 p-3 rounded-full"
            onPress={() => router.back()}
          >
            <Image
              source={icons.arrow}
              className="size-6"
              tintColor="#fff"
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </TouchableOpacity>

          <TouchableOpacity className="bg-dark-200/80 p-3 rounded-full">
            <Image source={icons.save} className="size-6" tintColor="#fff" />
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 200,
        }}
      >
        {/* Transparent trigger for Modal */}
        <Pressable
          style={{ height: POSTER_HEIGHT - 60, width: '100%' }}
          onPress={() => setIsModalVisible(true)}
        />

        {/* Content Card with minor translation limit */}
        <Animated.View
          className="bg-primary rounded-t-[40px] px-5 pt-10"
          style={[{ minHeight: SCREEN_HEIGHT + 200 }, cardAnimatedStyle]}
        >
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-medium text-white mb-2">{movie.title}</Text>
              <View className="flex-row items-center gap-x-4">
                <Text className="text-white text-sm">{movie.release_date?.split('-')[0]}</Text>
                <View className="w-1 h-1 bg-light-200 rounded-full" />
                <Text className="text-white text-sm">{movie.runtime} min</Text>
              </View>
            </View>

            <View className="bg-purple-950 px-4 py-2 rounded-2xl items-center">
              <View className="flex-row items-center gap-x-1">
                <Image source={icons.star} className="size-4" />
                <Text className="text-white font-bold text-lg">
                  {Math.round(movie.vote_average / 2)}
                </Text>
              </View>
              <Text className="text-white text-[8px] uppercase font-bold">Rating</Text>
            </View>
          </View>

          {/* Genres */}
          <View className="flex-row flex-wrap gap-2 mb-8">
            {movie.genres?.map((genre) => (
              <View key={genre.id} className="bg-purple-950 px-3 py-2 rounded-full border border-dark-300">
                <Text className="text-white text-xs">{genre.name}</Text>
              </View>
            ))}
          </View>

          {/* Overview */}
          <Text className="text-white text-xl font-bold mb-3">Overview</Text>
          <Text className="text-white text-base leading-6 mb-10">
            {movie.overview}
          </Text>

          <View style={{ height: TAB_BAR_HEIGHT + 50 }} />
        </Animated.View>
      </Animated.ScrollView>

      {/* Full-screen Image Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {isImageLoading && (
            <ActivityIndicator size="large" color="#AB8BFF" style={styles.loader} />
          )}
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.modalContent, modalAnimatedStyle]}>
              <Image
                source={{
                  uri: movie.poster_path
                    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                    : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
                }}
                style={styles.fullImage}
                resizeMode="contain"
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
              />

              {/* Close Button */}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeModal}
              >
                <Image
                  source={icons.arrow}
                  className="size-6"
                  tintColor="#fff"
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
              </TouchableOpacity>
            </Animated.View>
          </GestureDetector>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 30,
    zIndex: 10,
  }
});

export default MovieDetails;