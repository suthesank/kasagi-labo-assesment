"use client";
import { use } from "react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAnime } from "../context/AnimeContext";
import AnimeDetailsSkeleton from "@/components/AnimeDetailsSkeleton";
import { AnimeRecord } from "@/lib/types";
import RecommendationSkeleton from "@/components/RecommendationSkeleton";
import Link from "next/link";
import Image from "next/image";
import { fetchWithRetry } from "@/lib/utils";

export default function AnimeDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { favAnime, toggleFavAnime } = useAnime();

  const [anime, setAnime] = useState<AnimeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const [recommendations, setRecommendations] = useState<Record<string, any>[]>(
    []
  );
  const [loadingRecs, setLoadingRecs] = useState(true);

  const isFav = favAnime.some((a) => a.id.toString() === slug);

  useEffect(() => {
    let isCancelled = false;

    const fetchAnime = async () => {
      setLoading(true);

      try {
        const json = await fetchWithRetry(() =>
          fetch(`https://api.jikan.moe/v4/anime/${slug}`).then((r) => {
            if (!r.ok) throw new Error("Failed");
            return r.json();
          })
        );

        if (!isCancelled) {
          setAnime({
            id: json.data.mal_id,
            title: json.data.title,
            image: json.data.images?.jpg?.image_url,
            score: json.data.score,
            genres:
              json.data.genres?.map((g: { name: string }) => g.name) || [],
            synopsis: json.data.synopsis,
            status: json.data.status,
            episodes: json.data.episodes,
            duration: json.data.duration,
            studios:
              json.data.studios?.map((s: { name: string }) => s.name) || [],
          });
        }
      } catch (err) {
        console.error("Error fetching anime:", err);
      }

      if (!isCancelled) {
        setLoading(false);
        setTimeout(() => setReady(true), 50);
      }
    };

    const fetchRecommendations = async () => {
      setLoadingRecs(true);

      try {
        const json = await fetchWithRetry(() =>
          fetch(`https://api.jikan.moe/v4/anime/${slug}/recommendations`).then(
            (r) => {
              if (!r.ok) throw new Error("Failed");
              return r.json();
            }
          )
        );

        if (!isCancelled) {
          setRecommendations(json.data || []);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }

      if (!isCancelled) {
        setLoadingRecs(false);
      }
    };

    fetchAnime();
    fetchRecommendations();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  if (loading) return <AnimeDetailsSkeleton />;
  if (!anime)
    return (
      <div className="flex flex-col items-center justify-start py-20 px-4 text-center space-y-6">
        <div className="w-64 h-full aspect-video rounded-xl overflow-hidden shadow-lg relative">
          <Image
            src="/images/not-found.webp"
            alt="Anime Error Illustration"
            layout="fill"
          />
        </div>

        <h2 className="text-2xl font-bold flex items-center gap-2">
          No trace of that anime in our realm!
        </h2>

        <p className="max-w-md text-muted-foreground text-sm leading-relaxed">
          Try searching for another title—your next great adventure might be
          just a keyword away!
        </p>
      </div>
    );

  return (
    <div
      className={`
        max-w-7xl mx-auto p-6 
        transition-all duration-500
        ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
      `}
    >
      <Link href="/">
        <Button
          variant={"default"}
          className="rounded-lg cursor-pointer px-4 font-semibold mb-6"
        >
          Back
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* COVER IMAGE */}
        {anime.image && (
          <Card className="overflow-hidden rounded-2xl shadow-md relative aspect-225/319">
            <Image src={anime.image} alt={anime.title} layout="fill" />
          </Card>
        )}

        {/* INFO */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-3xl font-bold">{anime.title}</h1>

            <Button
              variant="default"
              size="icon"
              onClick={() => toggleFavAnime(anime)}
              className="rounded-full cursor-pointer hover:scale-110 transition"
            >
              <Heart
                className={`h-6 w-6 ${
                  isFav ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          </div>

          {/* GENRES */}
          <div className="flex flex-wrap gap-2">
            {anime.genres?.map((genre) => (
              <Badge key={genre} variant="default">
                {genre}
              </Badge>
            ))}
          </div>

          <Card className="shadow-none border-none h-full">
            <CardContent className="p-4 space-y-4 flex flex-col justify-between h-full">
              {/* SYNOPSIS */}
              <div>
                <h2 className="text-xl font-semibold mb-1">Synopsis</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {anime.synopsis || "No synopsis available."}
                </p>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-2 gap-4">
                <Detail label="Score" value={anime.score || "N/A"} />
                <Detail label="Status" value={anime.status} />
                <Detail label="Episodes" value={anime.episodes || "N/A"} />
                <Detail label="Duration" value={anime.duration} />
                <Detail
                  label="Studios"
                  value={anime.studios?.map((studio) => studio).join(", ")}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Recommended For You</h2>

        {loadingRecs ? (
          <RecommendationSkeleton />
        ) : recommendations.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No recommendations available.
          </p>
        ) : (
          <div className="flex gap-4 overflow-x-auto py-2">
            {recommendations.map((rec) => (
              <a
                key={rec.entry.mal_id}
                href={`/${rec.entry.mal_id}`}
                className="w-[200px]"
              >
                <div className="rounded-xl overflow-hidden shadow hover:scale-[1.02] transition-transform bg-card border h-full w-[200px]">
                  <div className="w-full h-auto relative aspect-225/319">
                    <Image
                      src={rec.entry.images.jpg.image_url}
                      alt={rec.entry.title}
                      layout="fill"
                    />
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-medium line-clamp-2">
                      {rec.entry.title}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended by {rec.votes} users
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
