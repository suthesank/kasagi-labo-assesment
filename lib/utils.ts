import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Genre } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
