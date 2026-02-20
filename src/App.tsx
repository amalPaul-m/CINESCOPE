import { useEffect, useMemo, useState } from "react";
import NavBar from "../components/navBar";
import HomePage from "./pages/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";

type AppRoute =
  | { type: "home" }
  | { type: "movie"; imdbID: string };

const THEME_STORAGE_KEY = "cine_scope_theme";

const getRouteFromPath = (path: string): AppRoute => {
  const movieMatch = path.match(/^\/movie\/([^/]+)$/);

  if (movieMatch) {
    return { type: "movie", imdbID: decodeURIComponent(movieMatch[1]) };
  }

  return { type: "home" };
};

const getInitialDarkMode = () => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark") {
    return true;
  }
  if (stored === "light") {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [path, setPath] = useState(() => window.location.pathname);
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
  const [isBootLoading, setIsBootLoading] = useState(true);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsBootLoading(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, []);

  const route = useMemo(() => getRouteFromPath(path), [path]);

  const navigateTo = (nextPath: string) => {
    if (window.location.pathname === nextPath) {
      return;
    }

    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-zinc-950 text-zinc-100" : "bg-red-50 text-red-950"}`}>
      {isBootLoading && (
        <div className="cine-loader">
          <div className="cine-loader__text" aria-label="CINESCOPE">
            {"CINESCOPE".split("").map((char, index) => (
              <span key={`${char}-${index}`} style={{ animationDelay: `${index * 0.08}s` }}>
                {char}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="hero-glow" />
      <NavBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showSearch={route.type === "home"}
        onHomeClick={() => navigateTo("/")}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
      />

      {route.type === "home" ? (
        <HomePage
          searchTerm={searchTerm}
          onSelectMovie={(imdbID) => navigateTo(`/movie/${imdbID}`)}
          isDarkMode={isDarkMode}
        />
      ) : (
        <MovieDetailsPage
          imdbID={route.imdbID}
          onBack={() => navigateTo("/")}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default App;
