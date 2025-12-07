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
      <header className="w-full flex items-center justify-between p-4 text-white fixed top-0 z-50 bg-white">
        <Link href="/">
          <h1 className="text-3xl font-extrabold font-sans tracking-wide">
            <span className="text-[#d22027] drop-shadow-[0_0_6px_#ff5555]">
              Ani
            </span>
            <span className="text-black drop-shadow-[0_0_4px_rgba(0,0,0,0.4)]">
              Vault
            </span>
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <GenreFilterDropdown />
          <Heart
            onClick={() => setOpen(true)}
            className="hover:scale-105 cursor-pointer transition"
            color="black"
          />
        </div>
      </header>

      <FavAnimeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Header;
