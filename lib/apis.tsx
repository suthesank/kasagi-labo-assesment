export const fetchAnimes = async (queryParams?: string) => {
  try {
    const url = queryParams
      ? `https://api.jikan.moe/v4/anime?${queryParams}`
      : "https://api.jikan.moe/v4/anime";

    const res = await fetch(url);

    if (!res.ok) {
      return {
        ok: false,
        error: `Request failed with status ${res.status}`,
        data: null,
      };
    }

    const jsonData = await res.json();

    return {
      ok: true,
      data: jsonData,
      error: null,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err.message || "Unknown error",
      data: null,
    };
  }
};

export const fetchGenres = async () => {
  try {
    const res = await fetch("https://api.jikan.moe/v4/genres/anime");

    if (!res.ok) {
      return {
        ok: false,
        error: `Request failed with status ${res.status}`,
        data: null,
      };
    }

    const jsonData = await res.json();

    return {
      ok: true,
      data: jsonData.data,
      error: null,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err.message || "Unknown error",
      data: null,
    };
  }
};
