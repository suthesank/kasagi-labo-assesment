import { useAnime } from "@/app/context/AnimeContext";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface FavAnimeModalProps {
  open: boolean;
  onClose: () => void;
}

const FavAnimeModal = ({ open, onClose }: FavAnimeModalProps) => {
  const { favAnime } = useAnime();
  const router = useRouter();

  const redictToAnime = useCallback(
    (id: string) => {
      router.push(`/${id}`);
      onClose();
    },
    [onClose, router]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4">Favorites</h2>

        {favAnime.length === 0 ? (
          <p className="text-gray-600">No favorite anime added yet.</p>
        ) : (
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {favAnime.map((a) => (
              <li
                key={a.id}
                className="p-3 rounded-lg border flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => redictToAnime(a.id)}
              >
                {a.image && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg relative">
                    {/* TODO: Investigate why Image component throws error here */}
                    <img src={a.image} alt={a.title} />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{a.title}</p>
                  {a.score ? (
                    <div className="flex items-center">
                      <p className="text-sm text-gray-600">{a.score}</p>
                      <Star
                        className="inline-block ml-1 h-4 w-4"
                        fill="orange"
                        color="orange"
                      />
                    </div>
                  ) : (
                    "Unknown Score"
                  )}
                  {/* <p className="text-sm text-gray-500">{a.score}</p> */}
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default FavAnimeModal;
