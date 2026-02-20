import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../services/omdb";
import type { MovieDetail } from "../types/movie";

type MovieDetailsPageProps = {
  imdbID: string;
  onBack: () => void;
  isDarkMode: boolean;
};

const getPoster = (poster?: string) => {
  if (poster && poster !== "N/A") {
    return poster;
  }

  return "https://via.placeholder.com/500x750/1f2937/ffffff?text=No+Poster";
};

const MovieDetailsPage = ({ imdbID, onBack, isDarkMode }: MovieDetailsPageProps) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      setLoading(true);
      try {
        const data = await fetchMovieDetails(imdbID);
        setMovie(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [imdbID]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <button
        type="button"
        onClick={onBack}
        className={`mb-6 rounded-lg border px-4 py-2 text-sm transition ${
          isDarkMode
            ? "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-red-400"
            : "border-red-300 bg-white text-red-700 hover:border-red-500"
        }`}
      >
        Back to Home
      </button>

      <section
        className={`rounded-3xl border p-4 sm:p-6 ${
          isDarkMode ? "border-zinc-800 bg-zinc-900/85" : "border-red-200 bg-white"
        }`}
      >
        {loading && (
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="skeleton h-[430px] w-full rounded-2xl" />
            <div className="space-y-3">
              <div className="skeleton h-8 w-2/3 rounded-md" />
              <div className="skeleton h-5 w-1/2 rounded-md" />
              <div className="skeleton h-20 w-full rounded-md" />
              <div className="skeleton h-5 w-4/5 rounded-md" />
              <div className="skeleton h-5 w-3/4 rounded-md" />
              <div className="skeleton h-5 w-5/6 rounded-md" />
            </div>
          </div>
        )}

        {!loading && movie && (
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <img
              src={getPoster(movie.Poster)}
              alt={movie.Title}
              className="h-[430px] w-full rounded-2xl object-cover"
            />

            <div className="space-y-4">
              <div>
                <h2 className={`text-3xl font-semibold ${isDarkMode ? "text-zinc-100" : "text-red-900"}`}>
                  {movie.Title}
                </h2>
                <p className={`mt-1 text-sm ${isDarkMode ? "text-zinc-400" : "text-red-500"}`}>
                  {movie.Year || "N/A"} • {movie.Runtime || "N/A"} • {movie.Rated || "NR"}
                </p>
              </div>

              <p className={`text-sm leading-7 ${isDarkMode ? "text-zinc-300" : "text-red-800"}`}>
                {movie.Plot || "No plot available."}
              </p>

              <div className={`grid gap-3 text-sm sm:grid-cols-2 ${isDarkMode ? "text-zinc-300" : "text-red-800"}`}>
                <p><span className={isDarkMode ? "text-zinc-500" : "text-red-500"}>Genre:</span> {movie.Genre || "N/A"}</p>
                <p><span className={isDarkMode ? "text-zinc-500" : "text-red-500"}>Released:</span> {movie.Released || "N/A"}</p>
                <p><span className={isDarkMode ? "text-zinc-500" : "text-red-500"}>Language:</span> {movie.Language || "N/A"}</p>
                <p><span className={isDarkMode ? "text-zinc-500" : "text-red-500"}>Director:</span> {movie.Director || "N/A"}</p>
                <p><span className={isDarkMode ? "text-zinc-500" : "text-red-500"}>Writer:</span> {movie.Writer || "N/A"}</p>
                <p><span className={isDarkMode ? "text-zinc-500" : "text-red-500"}>Cast:</span> {movie.Actors || "N/A"}</p>
                <p><span className={isDarkMode ? "text-zinc-500" : "text-red-500"}>IMDb:</span> {movie.imdbRating || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !movie && (
          <p
            className={`rounded-xl border p-4 text-sm ${
              isDarkMode ? "border-zinc-800 bg-zinc-900 text-zinc-300" : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            Movie details not available.
          </p>
        )}
      </section>
    </main>
  );
};

export default MovieDetailsPage;
