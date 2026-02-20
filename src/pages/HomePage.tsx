import { useEffect, useMemo, useState } from "react";
import AllMovieRow from "../../components/allMovieRow";
import LanguageFilterBar from "../../components/LanguageFilterBar";
import {
  OMDB_CONFIG,
  fetchMovieLanguage,
  fetchMovies,
  uniqueById,
} from "../services/omdb";
import type { LanguageState, Movie } from "../types/movie";

type HomePageProps = {
  searchTerm: string;
  onSelectMovie: (imdbID: string) => void;
  isDarkMode: boolean;
};

const HomePage = ({ searchTerm, onSelectMovie, isDarkMode }: HomePageProps) => {
  const [languageMovies, setLanguageMovies] = useState<LanguageState[]>([]);
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [movieLanguageMap, setMovieLanguageMap] = useState<Record<string, string>>({});
  const [activeLanguage, setActiveLanguage] = useState<string>("all");
  const [homeLoading, setHomeLoading] = useState(true);

  useEffect(() => {
    const loadHome = async () => {
      setHomeLoading(true);
      try {
        const latest = uniqueById([
          ...(await fetchMovies("movie", OMDB_CONFIG.latestYear, 2)),
          ...(await fetchMovies("new", OMDB_CONFIG.latestYear, 2)),
        ]);

        const curated = uniqueById([
          ...(await fetchMovies("action", undefined, 2)),
          ...(await fetchMovies("drama", undefined, 2)),
          ...(await fetchMovies("thriller", undefined, 2)),
          ...(await fetchMovies("adventure", undefined, 2)),
        ]);

        const allCombined = uniqueById([...latest, ...curated]);

        const languageResultsRaw = await Promise.allSettled(
          allCombined.map(async (movie) => ({
            imdbID: movie.imdbID,
            language: (await fetchMovieLanguage(movie.imdbID)).toLowerCase(),
          })),
        );

        const languageByMovieId = new Map<string, string>();
        languageResultsRaw.forEach((result) => {
          if (result.status === "fulfilled") {
            languageByMovieId.set(result.value.imdbID, result.value.language);
          }
        });
        setMovieLanguageMap(Object.fromEntries(languageByMovieId.entries()));

        const languageResults = OMDB_CONFIG.languageFilters.map((languageFilter) => ({
          key: languageFilter.key,
          label: languageFilter.label,
          movies: allCombined.filter((movie) => {
            const language = languageByMovieId.get(movie.imdbID) || "";
            return languageFilter.tokens.some((token) => language.includes(token));
          }),
        }));

        setLanguageMovies(languageResults);
        setLatestMovies(latest);
        setAllMovies(allCombined);
      } catch (error) {
        console.error(error);
      } finally {
        setHomeLoading(false);
      }
    };

    loadHome();
  }, []);

  const filteredAllMovies = useMemo(
    () =>
      uniqueById(allMovies).filter((movie) =>
        movie.Title.toLowerCase().includes(searchTerm.trim().toLowerCase()),
      ),
    [allMovies, searchTerm],
  );

  const activeLanguageMovies = useMemo(() => {
    if (activeLanguage === "all") {
      return languageMovies;
    }

    return languageMovies.filter((lang) => lang.key === activeLanguage);
  }, [activeLanguage, languageMovies]);

  const getMovieYear = (year?: string) => Number.parseInt(year || "0", 10) || 0;

  const sortByLatestYear = (movies: Movie[]) =>
    [...movies].sort((a, b) => getMovieYear(b.Year) - getMovieYear(a.Year));

  const matchesActiveLanguage = (movie: Movie) => {
    if (activeLanguage === "all") {
      return true;
    }

    const languageFilter = OMDB_CONFIG.languageFilters.find((lang) => lang.key === activeLanguage);
    if (!languageFilter) {
      return true;
    }

    const language = (movieLanguageMap[movie.imdbID] || "").toLowerCase();
    return languageFilter.tokens.some((token) => language.includes(token));
  };

  const latestMoviesToDisplay = useMemo(
    () => sortByLatestYear(latestMovies.filter(matchesActiveLanguage)),
    [latestMovies, activeLanguage, movieLanguageMap],
  );

  const allMoviesToDisplay = useMemo(
    () => sortByLatestYear(allMovies.filter(matchesActiveLanguage)),
    [allMovies, activeLanguage, movieLanguageMap],
  );

  return (
    <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-8">
      <section className="space-y-8">
        {searchTerm.trim() ? (
          <AllMovieRow
            title={`Search Results for "${searchTerm}"`}
            movies={filteredAllMovies}
            loading={homeLoading}
            onMovieClick={(movie) => onSelectMovie(movie.imdbID)}
            emptyMessage="No matching title found in loaded movies."
            horizontal={false}
            isDarkMode={isDarkMode}
          />
        ) : (
          <>
            <LanguageFilterBar
              activeLanguage={activeLanguage}
              languages={OMDB_CONFIG.languageFilters}
              onLanguageChange={setActiveLanguage}
              isDarkMode={isDarkMode}
            />

            <AllMovieRow
              title={`Latest Releases (${OMDB_CONFIG.latestYear})`}
              movies={latestMoviesToDisplay}
              loading={homeLoading}
              onMovieClick={(movie) => onSelectMovie(movie.imdbID)}
              isDarkMode={isDarkMode}
            />

            <AllMovieRow
              title="All Movies"
              movies={allMoviesToDisplay}
              loading={homeLoading}
              onMovieClick={(movie) => onSelectMovie(movie.imdbID)}
              isDarkMode={isDarkMode}
            />

            {activeLanguageMovies.map((language) => (
              <AllMovieRow
                key={language.key}
                title={`${language.label} Movies`}
                movies={language.movies}
                loading={homeLoading}
                onMovieClick={(movie) => onSelectMovie(movie.imdbID)}
                isDarkMode={isDarkMode}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
};

export default HomePage;
