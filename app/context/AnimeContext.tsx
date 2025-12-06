"use client";

import { AnimeRecord, Genre } from "@/lib/types";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AnimeContextType {
  favAnime: AnimeRecord[];
  selectedGenre: Genre[];
  toggleFavAnime: (anime: AnimeRecord) => void;
  toggleSelectedGenre: (genre: Genre) => void;
}

const AnimeContext = createContext<AnimeContextType | null>(null);

export const AnimeProvider = ({ children }: { children: ReactNode }) => {
  const [favAnime, setFavAnime] = useState<AnimeRecord[]>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("fav-animes");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [selectedGenre, setSelectedGenre] = useState<Genre[]>([]);

  // useEffect(() => {
  //   const stored = sessionStorage.getItem("fav-animes");
  //   if (stored) {
  //     Promise.resolve().then(() => {
  //       setFavAnime(JSON.parse(stored));
  //     });
  //   }
  // }, []);

  const toggleFavAnime = (anime: AnimeRecord) => {
    setFavAnime((prev) => {
      const exists = prev.some((a) => a.id === anime.id);

      return exists ? prev.filter((a) => a.id !== anime.id) : [...prev, anime];
    });
  };

  const toggleSelectedGenre = (genre: Genre) => {
    setSelectedGenre((prev) => {
      const exists = prev.some((g) => g.mal_id === genre.mal_id);

      return exists
        ? prev.filter((g) => g.mal_id !== genre.mal_id) // remove
        : [...prev, genre]; // add
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("fav-animes", JSON.stringify(favAnime));
    }
  }, [favAnime]);

  return (
    <AnimeContext.Provider
      value={{
        favAnime,
        selectedGenre,
        toggleFavAnime,
        toggleSelectedGenre,
      }}
    >
      {children}
    </AnimeContext.Provider>
  );
};

export const useAnime = () => {
  const context = useContext(AnimeContext);
  if (!context) {
    throw new Error("useAnime must be used within AnimeProvider");
  }
  return context;
};
