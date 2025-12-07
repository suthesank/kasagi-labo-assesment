"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useAnime } from "./context/AnimeContext";
import { fetchAnimes } from "@/lib/apis";
import { buildAnimeQueryParams } from "@/lib/utils";
import { AnimeCard, AnimeCardSkeleton } from "@/components/AnimeCards";
import { Button } from "@/components/ui/button";
import { useAnimeFetcher } from "@/lib/hooks/useAnimeFetcher";

function LoadMoreButton({
  paginationData,
  fetchMoreAnime,
  isLoading,
}: {
  paginationData: any;
  fetchMoreAnime: () => void;
  isLoading: boolean;
}) {
  if (paginationData) {
    const hasMore =
      paginationData.current_page < paginationData.last_visible_page;

    return hasMore ? (
      <div className="w-full flex justify-center my-6">
        <Button
          variant="default"
          onClick={() => fetchMoreAnime()}
          disabled={isLoading}
          className="cursor-pointer font-semibold hover:scale-105 transition"
        >
          {isLoading ? "Loading..." : "Load More"}
        </Button>
      </div>
    ) : (
      <p className="text-center text-muted-foreground my-6">
        You’ve reached the end of the list!
      </p>
    );
  }
}

export default function Home() {
  const { selectedGenre } = useAnime();

  const {
    allAnime,
    isLoading,
    error,
    paginationData,

    handleFetchMoreAnime,
  } = useAnimeFetcher(selectedGenre, fetchAnimes, buildAnimeQueryParams);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-start font-sans dark:bg-black">
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 w-full">
          {Array.from({ length: 24 }).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {error ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6">
              <div className="w-48 h-48 rounded-xl overflow-hidden shadow-lg relative">
                <Image
                  src="/images/error.webp"
                  alt="Anime Error Illustration"
                  layout="fill"
                />
              </div>

              <h2 className="text-2xl font-bold flex items-center gap-2">
                Oops! Something Went Wrong
              </h2>

              <p className="max-w-md text-muted-foreground text-sm leading-relaxed">
                Our heroes are working hard behind the scenes to fix this. Try
                refreshing the page or adjusting the filters!
              </p>
            </div>
          ) : (
            <>
              {allAnime && allAnime.length > 0 ? (
                <>
                  <div className="mt-20 mb-10 lg:mb-14 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-stretch-extra-expanded font-extrabold leading-none uppercase">
                      <span className="text-black">Explore the</span>
                      <br />
                      <span className="text-[#d22027]">Anime Universe</span>
                    </h1>
                    <h2 className="lg:text-xl mt-5 lg:mt-10 max-w-xl lg:max-w-2xl mx-4">
                      Discover stories crafted to captivate your imagination,
                      unleash legendary adventures, awaken forgotten powers, and
                      draw you into a universe where every episode fuels your
                      next obsession.
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 w-fit">
                    {allAnime.map((anime) => (
                      <AnimeCard key={anime.id} anime={anime} />
                    ))}
                  </div>
                  <LoadMoreButton
                    paginationData={paginationData}
                    isLoading={isLoading}
                    fetchMoreAnime={handleFetchMoreAnime}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6">
                  <div className="w-64 h-full aspect-video rounded-xl overflow-hidden shadow-lg relative">
                    <Image
                      src="/images/not-found.webp"
                      alt="Anime Error Illustration"
                      layout="fill"
                    />
                  </div>

                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    No Anime Detected in This Realm
                  </h2>

                  <p className="max-w-md text-muted-foreground text-sm leading-relaxed">
                    Your chosen genres forged a path too rare… No heroes, no
                    adventures, no battles were found.
                  </p>

                  <p className="max-w-md text-muted-foreground text-sm leading-relaxed">
                    Try adjusting your selection to summon new titles!
                  </p>
                </div>

                // <div className="w-full flex justify-center mt-10">
                //   <CardContent className="flex flex-col items-center gap-4">
                //     <SearchX className="w-12 h-12 text-muted-foreground" />

                //     <h2 className="text-xl font-bold">
                //       No Anime Detected in This Realm
                //     </h2>

                //     <p className="text-sm text-muted-foreground">
                //       Your chosen genres forged a path too rare… No heroes, no
                //       adventures, no battles were found.
                //     </p>

                //     <p className="text-sm font-medium flex items-center gap-1 text-primary mt-2">
                //       <Sparkles className="w-4 h-4" />
                //       Try adjusting your selection to summon new titles!
                //     </p>
                //   </CardContent>
                // </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
