import { useAnime } from "@/app/context/AnimeContext";
import { AnimeRecord } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Heart, Star } from "lucide-react";
import Image from "next/image";

interface Props {
  anime: AnimeRecord;
}

export const AnimeCard = ({ anime }: Props) => {
  const { toggleFavAnime, favAnime } = useAnime();

  return (
    <a key={anime.id} href={`/${anime.id}`}>
      <Card className="rounded-xl overflow-hidden shadow-sm transition-transform duration-200 hover:scale-[1.03] cursor-pointer border  h-full">
        <CardHeader className="p-0">
          {anime.image ? (
            <div className="aspect-225/319 w-full h-full relative">
              <Image src={anime.image} alt={anime.title} layout="fill" />
            </div>
          ) : (
            <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </CardHeader>

        <CardContent className="py-1 px-4 pb-4 space-y-2 justify-between flex flex-col h-full">
          <CardTitle className="text-lg font-semibold">{anime.title}</CardTitle>
          <div className="flex justify-between items-center w-full">
            {anime.score ? (
              <div className="flex items-center">
                <p className="text-sm text-gray-600">{anime.score}</p>
                <Star
                  className="inline-block ml-1 h-4 w-4"
                  fill="orange"
                  color="orange"
                />
              </div>
            ) : (
              "Unknown Score"
            )}

            <Heart
              color={favAnime.find((a) => a.id === anime.id) ? "red" : "black"}
              fill={favAnime.find((a) => a.id === anime.id) ? "red" : "none"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleFavAnime(anime);
              }}
            />
            {/* <Button size="sm" onClick={() => addFavAnime(anime)}>
            Add to Favorites
          </Button> */}
          </div>
        </CardContent>
      </Card>
    </a>
  );
};

export const AnimeCardSkeleton = () => {
  return (
    <Card className="rounded-xl overflow-hidden shadow-sm border animate-pulse min-w-[220px]">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-56" />
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-9 w-24 mt-2" />
      </CardContent>
    </Card>
  );
};
