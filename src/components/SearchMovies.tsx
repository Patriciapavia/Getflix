import React, { useCallback, useRef, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMovies } from '../hooks/useFetchMovies';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { Link } from 'react-router-dom';
import { FaPlus, FaCheck } from 'react-icons/fa';

const SearchMovies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);
  const [filterType, setFilterType] = useState<
    'movie' | 'series' | 'episode' | ''
  >('');
  const { addToWatchlist, watchlist, removeFromWatchlist } =
    useWatchlistStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      initialPageParam: 1,
      queryKey: ['movies', debouncedQuery, filterType],
      queryFn: ({ pageParam = 1 }) =>
        fetchMovies(debouncedQuery, pageParam, filterType),
      getNextPageParam: (lastPage, allPages) =>
        lastPage?.length === 10 ? allPages.length + 1 : undefined,
      enabled: !!debouncedQuery || !!filterType,
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
      <select
        id='movie-type'
        value={filterType}
        onChange={(e) =>
          setFilterType(e.target.value as 'movie' | 'series' | 'episode' | '')
        }
        className='mb-4 p-2 border border-netflixRed rounded bg-darkBg text-lightText'
      >
        <option value=''>Select Type</option>
        <option value='movie'>Movies</option>
        <option value='series'>Series</option>
        <option value='episode'>Episodes</option>
      </select>
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
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 mt-6'>
        {data?.pages.flat().map((movie, index) => (
          <div
            key={movie.imdbID}
            className='relative flex-none w-full p-2 sm:p-3 md:p-4 group transition-transform duration-300 hover:scale-105'
          >
            {/* Movie Poster */}
            <Link to={`/movie/${movie.imdbID}`}>
              <img
                src={movie.Poster}
                alt={movie.Title}
                className='w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[350px] object-cover rounded-lg shadow-lg'
              />
            </Link>

            {/* Movie Details */}
            <div className='absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white'>
              <h3 className='text-lg font-semibold truncate'>{movie.Title}</h3>
              <p className='text-gray-300 text-sm'>{movie.Year}</p>
            </div>
            <div className='absolute top-4 right-4'>
              {watchlist.some((m) => m.imdbID === movie.imdbID) ? (
                <button
                  onClick={() => removeFromWatchlist(movie.imdbID)}
                  className='px-3 py-1 bg-gray-700 text-white text-sm font-semibold rounded-md transition-transform transform hover:scale-105 hover:bg-gray-600 flex items-center gap-2'
                >
                  <FaCheck className='text-green-400' /> In Watchlist
                </button>
              ) : (
                <button
                  onClick={() => addToWatchlist(movie)}
                  className='px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-md transition-transform transform hover:scale-105 hover:bg-red-700 flex items-center gap-2'
                >
                  <FaPlus /> Add
                </button>
              )}
            </div>
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
