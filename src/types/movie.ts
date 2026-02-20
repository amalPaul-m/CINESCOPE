export type Movie = {
  imdbID: string;
  Title: string;
  Poster: string;
  Year?: string;
};

export type MovieDetail = Movie & {
  Plot?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Genre?: string;
  Runtime?: string;
  Rated?: string;
  Language?: string;
  imdbRating?: string;
  Released?: string;
};

export type LanguageState = {
  key: string;
  label: string;
  movies: Movie[];
};
