import { useEffect, useState, useCallback } from "react";
import { AnimeRecord, Genre } from "../types";
import { fetchWithRetry } from "../utils";

interface Pagination {
  current_page: number;
  last_visible_page: number;
}

interface FetchReturn {
  ok: boolean;
  data?: any;
  error?: string | null;
}

export function useAnimeFetcher(
  selectedGenre: Genre[],
  fetchAnimes: (params: string) => Promise<FetchReturn>,
  buildAnimeQueryParams: (genre: Genre[], page: number) => string
) {
  const [allAnime, setAllAnime] = useState<AnimeRecord[]>([]);
  const [paginationData, setPaginationData] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------
  // ⭐ Helper: map API response to AnimeRecord[]
  // -------------------------------------------------
  const mapAnime = useCallback((data: any): AnimeRecord[] => {
    return data.map((item: any) => ({
      id: item.mal_id,
      title: item.title,
      image: item.images?.jpg?.image_url,
      score: item.score,
      scored_by: item.scored_by,
    }));
  }, []);

  // -------------------------------------------------
  // ⭐ Fetch initial anime (runs on genre change)
  // -------------------------------------------------
  const fetchInitialAnime = useCallback(async () => {
    let cancelled = false;
    const queryParams = buildAnimeQueryParams(selectedGenre, 1);

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchWithRetry(() => fetchAnimes(queryParams));

      if (!cancelled && res.ok && res.data) {
        const pag = res.data.pagination;
        const list = mapAnime(res.data.data);

        setPaginationData(pag);
        setAllAnime(list);
      }
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Something went wrong.");
    } finally {
      if (!cancelled) setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [selectedGenre, fetchAnimes, mapAnime, buildAnimeQueryParams]);

  // -------------------------------------------------
  // ⭐ Fetch more anime (runs on page change)
  // -------------------------------------------------
  const fetchMoreAnime = useCallback(async () => {
    // Skip first page (handled in fetchInitialAnime)
    if (paginationData?.current_page === 1) return;

    let cancelled = false;

    const queryParams = buildAnimeQueryParams(
      selectedGenre,
      paginationData?.current_page || 1
    );

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchWithRetry(() => fetchAnimes(queryParams));

      if (!cancelled && res.ok && res.data) {
        const more = mapAnime(res.data.data);
        setAllAnime((prev) => {
          const combined = [...prev, ...more];

          const unique = Array.from(
            new Map(combined.map((anime) => [anime.id, anime])).values()
          );

          return unique;
        });

        setPaginationData(res.data.pagination);
      }
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load more anime.");
    } finally {
      if (!cancelled) setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [
    selectedGenre,
    fetchAnimes,
    mapAnime,
    buildAnimeQueryParams,
    paginationData?.current_page,
  ]);

  // -------------------------------------------------
  // 🔥 Trigger effects automatically
  // -------------------------------------------------
  useEffect(() => {
    fetchInitialAnime();
  }, [selectedGenre, fetchInitialAnime]);

  useEffect(() => {
    fetchMoreAnime();
  }, [paginationData?.current_page, fetchMoreAnime]);

  // -------------------------------------------------
  // 🔥 Handler to trigger fetching more anime
  // -------------------------------------------------
  const handleFetchMoreAnime = useCallback(() => {
    setPaginationData((prev) => {
      if (prev) {
        return { ...prev, current_page: prev.current_page + 1 };
      }
      return prev;
    });
  }, []);

  // -------------------------------------------------
  // 🎉 Return API
  // -------------------------------------------------
  return {
    allAnime,
    isLoading,
    error,
    paginationData,
    fetchInitialAnime,
    setAllAnime,
    setPaginationData,
    handleFetchMoreAnime,
  };
}
