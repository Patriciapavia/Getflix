import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../hooks/useFetchMovies';
import { useQuery } from '@tanstack/react-query';
import { Movie } from '../types/movie';
import { motion } from 'framer-motion';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading } = useQuery<Movie>({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieDetails(id!),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <p className='text-center mt-4 text-white' role='status'>
        Loading...
      </p>
    );

  const renderStars = (rating: string | undefined) => {
    if (!rating) return null;
    const stars: React.ReactNode[] = [];
    const numericRating = parseFloat(rating) / 2;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= numericRating ? 'text-yellow-400' : 'text-gray-600'}
        >
          {'\u2605'}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white text-black dark:bg-black dark:text-white bg-opacity-75 z-50 p-4 md:p-8'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className='relative max-w-5xl w-full bg-white text-black dark:bg-black dark:text-white rounded-lg overflow-hidden shadow-lg'
      >
        {/* Movie Layout */}
        <div className='flex flex-col lg:flex-row'>
          {/* Background Image */}
          <div className='relative w-full lg:w-1/2 h-[300px] md:h-[400px] lg:h-[450px] flex justify-center items-center'>
            <img
              src={movie?.Poster}
              alt={movie?.Title}
              className='w-full h-full object-fit lg:object-contain '
            />
            {/* Adjusted Dark Overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70'></div>
          </div>

          {/* Movie Details */}
          <div className='p-4 md:p-8 w-full lg:w-1/2'>
            <h1 className='text-2xl md:text-4xl font-bold'>{movie?.Title}</h1>
            <p className='text-gray-400 mt-2 text-sm md:text-lg'>
              {movie?.Year} • {movie?.Genre} • {movie?.Runtime}
            </p>

            <p className='mt-4 text-sm md:text-lg'>
              <strong>Plot:</strong> {movie?.Plot}
            </p>
            <p className='mt-2 text-sm md:text-lg'>
              <strong>Director:</strong> {movie?.Director}
            </p>
            <p className='text-sm md:text-lg'>
              <strong>Actors:</strong> {movie?.Actors}
            </p>
            <p className='text-sm md:text-lg'>
              <strong>Genre:</strong> {movie?.Genre}
            </p>
            <p className='text-sm md:text-lg'>
              <strong>IMDB Rating:</strong> {movie?.imdbRating}
            </p>
            <p className='text-sm md:text-lg'>
              <strong>Runtime:</strong> {movie?.Runtime}
            </p>
            <p className='text-sm md:text-lg'>
              <strong>Awards:</strong> {movie?.Awards}
            </p>

            {/* Star Rating */}
            <div className='mt-4 flex items-center space-x-2 text-sm md:text-lg'>
              {renderStars(movie?.imdbRating)}
              <span className='text-gray-400'>({movie?.imdbRating} / 10)</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <Link
          to='/'
          className='absolute top-4 right-4 bg-white text-black dark:bg-black dark:text-white text-2xl hover:text-gray-300'
        >
          ✕
        </Link>
      </motion.div>
    </div>
  );
};

export default MovieDetails;
