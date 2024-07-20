import { useEffect, useState, useCallback } from "react";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import WatchedSummary from "./WatchedSummary";
import Box from "./Box";
import NavBar from "./NavBar";
import NumResults from "./NumResults";
import Search from "./Search";
import Main from "./Main";
import WatchedMoviesList from "./WatchedMovieList";
import MovieDetails from "./MovieDetails";
import MovieList from "./MovieList";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

const KEY = process.env.REACT_APP_API_KEY;

export default function App() {
  const [query, setQuery] = useState("");
  // const [watched, setWatched] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const handleCloseMovie = useCallback(() => setSelectedId(null), []);
  const { movies, isLoading, error } = useMovies(query, KEY, handleCloseMovie);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem("watched") || [];
  //   return JSON.parse(storedValue);
  // });

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelect={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onClose={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
              KEY={KEY}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDelete={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
