import { useRef } from "react";
import type { Movie } from "../src/types/movie";

type MovieRowProps = {
  title: string;
  movies: Movie[];
  loading?: boolean;
  onMovieClick: (movie: Movie) => void;
  emptyMessage?: string;
  horizontal?: boolean;
  isDarkMode?: boolean;
};

const renderPoster = (poster: string) =>
  poster && poster !== "N/A"
    ? poster
    : "https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Poster";

const AllMovieRow = ({
  title,
  movies,
  loading = false,
  onMovieClick,
  emptyMessage = "No movies found in this category.",
  horizontal = true,
  isDarkMode = false,
}: MovieRowProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const showNavigation = horizontal && !loading && movies.length > 6;

  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  const titleText = isDarkMode ? "text-zinc-100" : "text-red-900";
  const countText = isDarkMode ? "text-zinc-400" : "text-red-500";
  const panelClass = isDarkMode ? "border-zinc-800 bg-zinc-900" : "border-red-200 bg-white";
  const cardText = isDarkMode ? "text-zinc-100" : "text-red-900";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-semibold tracking-tight ${titleText}`}>{title}</h2>
        {!loading && <p className={`text-xs uppercase tracking-[0.18em] ${countText}`}>{movies.length} Titles</p>}
      </div>

      <div className="relative">
        {showNavigation && (
          <>
            <button
              type="button"
              aria-label={`Scroll ${title} left`}
              className={`absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border p-2 backdrop-blur md:block ${
                isDarkMode
                  ? "border-zinc-700 bg-zinc-900/95 text-zinc-200 hover:border-red-400"
                  : "border-red-300 bg-white/95 text-red-700 hover:border-red-500"
              }`}
              onClick={() => scrollByAmount(-480)}
            >
              &lt;
            </button>
            <button
              type="button"
              aria-label={`Scroll ${title} right`}
              className={`absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border p-2 backdrop-blur md:block ${
                isDarkMode
                  ? "border-zinc-700 bg-zinc-900/95 text-zinc-200 hover:border-red-400"
                  : "border-red-300 bg-white/95 text-red-700 hover:border-red-500"
              }`}
              onClick={() => scrollByAmount(480)}
            >
              &gt;
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className={
            horizontal
              ? "hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2 pr-1"
              : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          }
        >
          {loading &&
            Array.from({ length: 8 }).map((_, index) => (
              <article
                key={`skeleton-${index}`}
                className={`overflow-hidden rounded-2xl border ${panelClass} ${horizontal ? "w-44 shrink-0" : ""}`}
              >
                <div className="skeleton h-56 w-full" />
                <div className="space-y-2 p-3">
                  <div className="skeleton h-4 w-5/6 rounded-md" />
                  <div className="skeleton h-3 w-1/3 rounded-md" />
                </div>
              </article>
            ))}

          {!loading &&
            movies.map((movie) => (
              <button
                key={movie.imdbID}
                type="button"
                className={`movie-card group overflow-hidden rounded-2xl border text-left transition hover:-translate-y-1 ${panelClass} ${
                  isDarkMode
                    ? "hover:border-red-400 hover:shadow-[0_14px_30px_-16px_rgba(239,68,68,0.35)]"
                    : "hover:border-red-400 hover:shadow-[0_14px_30px_-16px_rgba(239,68,68,0.45)]"
                } ${horizontal ? "w-44 shrink-0" : "w-full"}`}
                onClick={() => onMovieClick(movie)}
              >
                <div className="movie-poster-wrap relative">
                  <img
                    src={renderPoster(movie.Poster)}
                    alt={movie.Title}
                    className="movie-poster h-56 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="movie-light-sweep" />
                  <span className="absolute bottom-2 right-2 rounded-full border border-white/20 bg-black/70 px-2 py-0.5 text-xs text-white">
                    {movie.Year || "----"}
                  </span>
                </div>
                <div className="p-3">
                  <p className={`line-clamp-2 min-h-10 text-sm font-medium ${cardText}`}>{movie.Title}</p>
                </div>
              </button>
            ))}
        </div>
      </div>

      {!loading && movies.length === 0 && (
        <p
          className={`rounded-xl border p-4 text-sm ${
            isDarkMode ? "border-zinc-800 bg-zinc-900 text-zinc-300" : "border-red-200 bg-white text-red-700"
          }`}
        >
          {emptyMessage}
        </p>
      )}
    </section>
  );
};

export default AllMovieRow;
