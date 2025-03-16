import { useCallback, useRef, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMovies } from '../hooks/useFetchMovies';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SearchMovies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);

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
      {/* Search input for movies */}
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

      {/* Show loading state */}
      {isLoading && (
        <p className='text-center mt-4' role='status'>
          Loading...
        </p>
      )}

      {/* Movie grid layout */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6'>
        {data?.pages.flat().map((movie, index) => (
          <Link
            to={`/movie/${movie.imdbID}`}
            key={movie.imdbID}
            aria-label={`View details for ${movie.Title}`}
            ref={
              index === data.pages.flat().length - 1
                ? (node) => lastMovieRef(node as unknown as HTMLDivElement)
                : null
            }
          >
            {/* Movie card with animations */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='border rounded-lg overflow-hidden shadow-md bg-secondary hover:bg-accent transition-transform focus-within:ring-2 focus-within:ring-blue-500'
              tabIndex={0}
            >
              {/* Movie poster */}
              <img
                src={movie.Poster}
                alt={`Poster of ${movie.Title}`}
                className='w-full h-72 object-cover'
              />
              <div className='p-3 text-center'>
                {/* Movie title and year */}
                <h3 className='text-lg font-semibold'>{movie.Title}</h3>
                <p>{movie.Year}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Show loading indicator for infinite scrolling */}
      {isFetchingNextPage && (
        <p className='text-center mt-4'>Loading more...</p>
      )}
    </div>
  );
};

export default SearchMovies;
