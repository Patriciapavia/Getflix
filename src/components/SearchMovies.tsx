import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../hooks/useFetchMovies';
import { Link } from 'react-router-dom';
import { Movie } from '../types/movie';

const SearchMovies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);

  const { data: movies, isLoading } = useQuery<Movie[]>({
    queryKey: ['movies', debouncedQuery],
    queryFn: () => fetchMovies(debouncedQuery),
    enabled: !!debouncedQuery,
  });

  console.log(movies);
  return (
    <div className='p-4 max-w-4xl mx-auto'>
      <label htmlFor='movie-search' className='sr-only'>
        Search for a movie
      </label>
      <input
        id='movie-search'
        type='text'
        placeholder='Search for a movie...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className='w-full p-3 border rounded-lg shadow-sm'
        aria-label='Search for a movie'
      />
      {isLoading && <p className='text-center mt-4'>Loading...</p>}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
        {movies?.map((movie) => (
          <Link
            to={`/movie/${movie.imdbID}`}
            key={movie.imdbID}
            aria-label={`View details for ${movie.Title}`}
          >
            <div
              className='border rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform focus-within:ring-2 focus-within:ring-blue-500'
              tabIndex={0}
            >
              <img
                src={movie.Poster}
                alt={`Poster of ${movie.Title}`}
                className='w-full h-56 object-cover'
              />
              <div className='p-3'>
                <h3 className='text-lg font-semibold'>{movie.Title}</h3>
                <p>{movie.Year}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchMovies;
