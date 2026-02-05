import { createClient } from "@supabase/supabase-js";

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
