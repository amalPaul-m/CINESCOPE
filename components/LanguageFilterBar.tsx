import type { LanguageState } from "../src/types/movie";

type LanguageFilterBarProps = {
  activeLanguage: string;
  languages: ReadonlyArray<Pick<LanguageState, "key" | "label">>;
  onLanguageChange: (language: string) => void;
  isDarkMode: boolean;
};

const LanguageFilterBar = ({
  activeLanguage,
  languages,
  onLanguageChange,
  isDarkMode,
}: LanguageFilterBarProps) => {
  return (
    <div
      className={`space-y-4 rounded-3xl border p-5 ${
        isDarkMode ? "border-zinc-800 bg-zinc-900/85" : "border-red-200 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className={`text-xs uppercase tracking-[0.2em] ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
            Languages
          </p>
          <h2 className={`text-lg font-semibold ${isDarkMode ? "text-zinc-100" : "text-red-900"}`}>
            Browse by Language
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onLanguageChange("all")}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              activeLanguage === "all"
                ? "bg-red-600 text-white"
                : isDarkMode
                  ? "border border-zinc-700 text-zinc-200 hover:border-red-400"
                  : "border border-red-200 text-red-700 hover:border-red-400"
            }`}
          >
            All
          </button>
          {languages.map((language) => (
            <button
              key={language.key}
              type="button"
              onClick={() => onLanguageChange(language.key)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                activeLanguage === language.key
                  ? "bg-red-600 text-white"
                  : isDarkMode
                    ? "border border-zinc-700 text-zinc-200 hover:border-red-400"
                    : "border border-red-200 text-red-700 hover:border-red-400"
              }`}
            >
              {language.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageFilterBar;
