import axios from 'axios';
import { Movie } from '../types/movie';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  const { data } = await axios.get<{ Search: Movie[] }>(
    `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`
  );
  return data.Search || [];
};

export const fetchMovieDetails = async (id: string): Promise<Movie> => {
  const { data } = await axios.get<Movie>(
    `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`
  );
  return data;
};
