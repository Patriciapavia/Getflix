import { useCallback, useRef, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMovies } from '../hooks/useFetchMovies';
import { motion } from 'framer-motion';
import { useWatchlistStore } from '../store/useWatchlistStore';

const SearchMovies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);
  const { addToWatchlist, watchlist, removeFromWatchlist } =
    useWatchlistStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ['movies', debouncedQuery],
      queryFn: ({ pageParam = 1 }) => fetchMovies(debouncedQuery, pageParam),
      getNextPageParam: (lastPage, allPages) =>
        lastPage?.length === 10 ? allPages.length + 1 : undefined,
      enabled: !!debouncedQuery,
    });

  // Intersection Observer to detect when the last movie item is in view
  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node); // Attach observer to last movie item
    },
    [isLoading, isFetchingNextPage, fetchNextPage, hasNextPage]
  );
  return (
    <div className='p-4 max-w-6xl mx-auto bg-darkBg text-lightText min-h-screen'>
      <label htmlFor='movie-search' className='sr-only'>
        Search for a movie
      </label>
      <input
        id='movie-search'
        type='text'
        placeholder='Search for a movie...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className='w-full p-3 border rounded-lg shadow-sm bg-darkBg text-lightText placeholder-mutedText'
        aria-label='Search for a movie'
      />
      {isLoading && (
        <p className='text-center mt-4 text-mutedText' role='status'>
          Loading...
        </p>
      )}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6'>
        {data?.pages.flat().map((movie, index) => (
          <div
            key={movie.imdbID}
            ref={
              index === data.pages.flat().length - 1
                ? (node) => lastMovieRef(node as HTMLDivElement)
                : null
            }
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='border rounded-lg overflow-hidden shadow-md bg-secondary hover:bg-accent transition-transform focus-within:ring-2 focus-within:ring-blue-500'
              tabIndex={0}
            >
              <img
                src={movie.Poster}
                alt={`Poster of ${movie.Title}`}
                className='w-full h-72 object-cover'
              />
              <div className='p-3 text-center'>
                <h3 className='text-lg font-semibold text-lightText'>
                  {movie.Title}
                </h3>
                <p className='text-mutedText'>{movie.Year}</p>
                {watchlist.some((m) => m.imdbID === movie.imdbID) ? (
                  <button
                    onClick={() => removeFromWatchlist(movie.imdbID)}
                    className='mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700'
                  >
                    Remove from Watchlist
                  </button>
                ) : (
                  <button
                    onClick={() => addToWatchlist(movie)}
                    className='mt-2 px-4 py-2 bg-netflixRed text-white rounded-md hover:bg-red-700'
                  >
                    Add to Watchlist
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      {isFetchingNextPage && (
        <p className='text-center mt-4 text-mutedText'>Loading more...</p>
      )}
    </div>
  );
};

export default SearchMovies;
