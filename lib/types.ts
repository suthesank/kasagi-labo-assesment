export interface AnimeRecord {
  id: string;
  title: string;
  image?: string;
  score?: number;
  scored_by?: number;
  genres?: string[];
  synopsis?: string;
  status?: string;
  episodes?: number;
  duration?: string;
  studios?: string[];
}

export interface Genre {
  mal_id: number;
  name: string;
}
