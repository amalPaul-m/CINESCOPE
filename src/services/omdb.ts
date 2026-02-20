import type { Movie, MovieDetail } from "../types/movie";

const API_KEY = "9459457f";

export const OMDB_CONFIG = {
  apiKey: API_KEY,
  latestYear: String(new Date().getFullYear() - 1),
  languageFilters: [
    { key: "english", label: "English", tokens: ["english"] },
    { key: "hindi", label: "Hindi", tokens: ["hindi"] },
    { key: "tamil", label: "Tamil", tokens: ["tamil"] },
    { key: "malayalam", label: "Malayalam", tokens: ["malayalam"] },
    { key: "korean", label: "Korean", tokens: ["korean"] },
  ] as const,
};

export const uniqueById = (movies: Movie[]) => {
  const map = new Map<string, Movie>();
  movies.forEach((movie) => map.set(movie.imdbID, movie));
  return Array.from(map.values());
};

export const fetchMovies = async (query: string, year?: string, pages = 1): Promise<Movie[]> => {
  const movies: Movie[] = [];

  for (let page = 1; page <= pages; page += 1) {
    const params = new URLSearchParams({
      apikey: API_KEY,
      s: query,
      type: "movie",
      page: String(page),
    });

    if (year) {
      params.set("y", year);
    }

    const response = await fetch(`https://www.omdbapi.com/?${params.toString()}`);
    const data = await response.json();

    if (!data.Search) {
      break;
    }

    movies.push(...data.Search);
  }

  return movies;
};

export const fetchMovieLanguage = async (imdbID: string): Promise<string> => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
  const data = await response.json();
  return data.Language || "";
};

export const fetchMovieDetails = async (imdbID: string): Promise<MovieDetail | null> => {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`,
  );
  const data = await response.json();

  if (!data || data.Response === "False") {
    return null;
  }

  return data as MovieDetail;
};
