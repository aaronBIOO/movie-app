-- Create trending_movies table
CREATE TABLE IF NOT EXISTS trending_movies (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  movie_id INTEGER NOT NULL,
  searchTerm TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  poster_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Optional but recommended)
-- ALTER TABLE trending_movies ENABLE ROW LEVEL SECURITY;

-- Create policy for public read (Optional)
-- CREATE POLICY "Allow public read access" ON trending_movies FOR SELECT USING (true);
