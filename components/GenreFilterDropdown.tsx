"use client";

import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAnime } from "@/app/context/AnimeContext";
import { Genre } from "@/lib/types";
import { Filter } from "lucide-react";
import { fetchWithRetry } from "@/lib/utils";
import { fetchGenres } from "@/lib/apis";

export function GenreFilterDropdown() {
  const { selectedGenre, toggleSelectedGenre } = useAnime();

  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available genres
  useEffect(() => {
    let isMounted = true;
    async function fetchGenresWithRetry() {
      try {
        const res = await fetchWithRetry(fetchGenres);
        if (!res.ok) throw new Error(res.error || "Failed to fetch genres");
        if (isMounted && res.ok && res.data) {
          setGenres(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchGenresWithRetry();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Filter
          className="hover:scale-105 cursor-pointer transition"
          color="black"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 p-2">
        {loading ? (
          <div className="p-3 text-sm text-muted-foreground">Loading…</div>
        ) : (
          <ScrollArea className="h-64">
            <div className="flex flex-col gap-3">
              {genres.map((genre) => {
                const checked = selectedGenre.some(
                  (g) => g.mal_id === genre.mal_id
                );

                return (
                  <label
                    key={genre.mal_id}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleSelectedGenre(genre)}
                    />
                    {genre.name}
                  </label>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
