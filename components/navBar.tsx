type NavBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showSearch?: boolean;
  onHomeClick?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

const NavBar = ({
  searchTerm,
  setSearchTerm,
  showSearch = true,
  onHomeClick,
  isDarkMode,
  onToggleTheme,
}: NavBarProps) => {
  return (
    <header
      className={`sticky top-0 z-20 border-b backdrop-blur-lg ${
        isDarkMode ? "border-zinc-800 bg-zinc-950/95" : "border-red-200 bg-white/95"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onHomeClick} className="text-left">
          <p className={`text-xs uppercase tracking-[0.24em] ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
            CineScope
          </p>
          <h1 className={`text-2xl font-semibold ${isDarkMode ? "text-zinc-100" : "text-red-900"}`}>
            Movie Discovery Platform
          </h1>
        </button>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          {showSearch && (
            <div className="w-full sm:w-80">
              <label htmlFor="movie-search" className="sr-only">
                Search movies
              </label>
              <input
                id="movie-search"
                type="text"
                placeholder="Search all movies by title..."
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  isDarkMode
                    ? "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-red-400"
                    : "border-red-200 bg-white text-red-900 placeholder:text-red-300 focus:border-red-500"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          <button
            type="button"
            onClick={onToggleTheme}
            className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
              isDarkMode
                ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-red-400"
                : "border-red-200 bg-white text-red-700 hover:border-red-500"
            }`}
            aria-label="Toggle dark and light mode"
            title="Toggle theme"
          >
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0 4a1 1 0 0 1 1 1v0a1 1 0 1 1-2 0v0a1 1 0 0 1 1-1Zm0-20a1 1 0 0 1 1-1v0a1 1 0 1 1-2 0v0a1 1 0 0 1 1 1Zm10 10a1 1 0 0 1 1 1v0a1 1 0 1 1-2 0v0a1 1 0 0 1 1-1ZM2 12a1 1 0 0 1 1 1v0a1 1 0 1 1-2 0v0a1 1 0 0 1 1-1Zm16.95 6.536a1 1 0 0 1 1.414 0v0a1 1 0 0 1-1.414 1.414v0a1 1 0 1 1 0-1.414ZM3.636 3.636a1 1 0 0 1 1.414 0v0A1 1 0 0 1 3.636 5.05v0a1 1 0 0 1 0-1.414Zm15.314-1.414a1 1 0 0 1 1.414 1.414v0a1 1 0 1 1-1.414-1.414ZM3.636 18.95a1 1 0 0 1 1.414 1.414v0A1 1 0 0 1 3.636 18.95Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M21 14.25A8.25 8.25 0 1 1 9.75 3a7.5 7.5 0 1 0 11.25 11.25Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
