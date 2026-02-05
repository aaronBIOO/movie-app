import { createClient } from "@supabase/supabase-js";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create and update search count
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const { data: existingMovies, error: fetchError } = await supabase
      .from("trending_movies")
      .select("*")
      .eq("searchTerm", query)
      .limit(1);

    if (fetchError) throw fetchError;

    if (existingMovies && existingMovies.length > 0) {
      const existingMovie = existingMovies[0];
      const { error: updateError } = await supabase
        .from("trending_movies")
        .update({ count: existingMovie.count + 1 })
        .eq("id", existingMovie.id);

      if (updateError) throw updateError;
    } else {
      const { error: createError } = await supabase
        .from("trending_movies")
        .insert({
          searchTerm: query,
          movie_id: movie.id,
          title: movie.title,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        });

      if (createError) throw createError;
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

// Get trending movies
export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const { data, error } = await supabase
      .from("trending_movies")
      .select("*")
      .order("count", { ascending: false })
      .limit(5);

    if (error) throw error;

    return data as unknown as TrendingMovie[];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return undefined;
  }
};

// Auth Functions
export const signInWithGoogle = async () => {
  try {
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: "movies",
    });
    console.log("Redirect URI:", redirectUri);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    const res = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectUri
    );

    if (res.type === "success") {
      const { url } = res;
      const hash = url.split("#")[1];
      const params = hash.split("&").reduce((acc, part) => {
        const [key, value] = part.split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      });

      if (sessionError) throw sessionError;
      return sessionData;
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
