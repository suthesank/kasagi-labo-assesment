import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Genre } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchWithRetry = async (
  fn: () => Promise<any>,
  attempt = 1
): Promise<any> => {
  try {
    return await fn();
  } catch (err) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 1000));
      return fetchWithRetry(fn, attempt + 1);
    }
    throw err;
  }
};

export const buildAnimeQueryParams = (
  selectedGenre?: Genre[],
  currentPage?: number
) => {
  const params = new URLSearchParams();

  if (selectedGenre) {
    params.set("genres", selectedGenre.map((g) => g.mal_id).join(","));
  }

  if (currentPage && currentPage > 0) {
    params.set("page", String(currentPage));
  }

  params.set("limit", "24");

  return params.toString();
};
