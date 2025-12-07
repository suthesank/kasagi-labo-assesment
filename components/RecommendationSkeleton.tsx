import { AnimeCardSkeleton } from "./AnimeCards";

export default function RecommendationSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="min-w-[200px] space-y-2">
          <AnimeCardSkeleton />
        </div>
      ))}
    </div>
  );
}
