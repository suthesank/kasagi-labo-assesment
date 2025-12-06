"use client";

import { useState } from "react";
import FavAnimeModal from "./FavAnimeModal";
import { Heart } from "lucide-react";
import { GenreFilterDropdown } from "./GenreFilterDropdown";
import Link from "next/link";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="w-full flex items-center justify-between p-4 bg-gray-900 text-white shadow fixed top-0 z-50">
        <Link href="/">
          <h1 className="text-xl font-semibold">AniVault</h1>
        </Link>
        <div className="flex items-center gap-4">
          <GenreFilterDropdown />
          <Heart
            onClick={() => setOpen(true)}
            className="hover:scale-105 cursor-pointer transition"
          />
        </div>
      </header>

      <FavAnimeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Header;
