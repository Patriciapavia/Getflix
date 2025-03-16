import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../hooks/useFetchMovies';
import { useQuery } from '@tanstack/react-query';
import { Movie } from '../types/movie';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading } = useQuery<Movie>({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieDetails(id!),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <p className='text-center mt-4' role='status'>
        Loading...
      </p>
    );

  return (
    <div className='p-6 max-w-4xl mx-auto border rounded-lg shadow-lg'>
      <Link
        to='/'
        className='text-blue-500 underline'
        aria-label='Back to search'
      >
        ← Back to Search
      </Link>
      {movie && (
        <div className='mt-6 flex flex-col md:flex-row gap-6'>
          <img
            src={movie.Poster}
            alt={`Poster of ${movie.Title}`}
            className='w-64 rounded-lg shadow-md'
          />
          <div>
            <h1 className='text-3xl font-bold' tabIndex={0}>
              {movie.Title} ({movie.Year})
            </h1>
            <p className='mt-2'>
              <strong>Plot:</strong> {movie.Plot}
            </p>
            <p className='mt-2'>
              <strong>Director:</strong> {movie.Director}
            </p>
            <p>
              <strong>Actors:</strong> {movie.Actors}
            </p>
            <p>
              <strong>Genre:</strong> {movie.Genre}
            </p>
            <p>
              <strong>IMDB Rating:</strong> {movie.imdbRating}
            </p>
          </div>
        </div>
      )}
    </div>
  );
  2;
};

export default MovieDetails;
