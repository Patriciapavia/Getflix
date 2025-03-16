import { fetchMovies, fetchMovieDetails } from '../hooks/useFetchMovies';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { test, expect } from 'vitest';
const mock = new MockAdapter(axios);

const API_KEY = 'test_api_key';

mock
  .onGet(`https://www.omdbapi.com/?s=test&page=1&type=movie&apikey=${API_KEY}`)
  .reply(200, {
    Search: [
      {
        imdbID: 'tt1375666',
        Title: 'Inception',
        Year: '2010',
        Poster:
          'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
        Type: 'movie',
      },
    ],
  });

mock
  .onGet(`https://www.omdbapi.com/?i=tt1375666&apikey=${API_KEY}`)
  .reply(200, {
    Title: 'Inception',
    Year: '2010',
    Rated: 'PG-13',
    Released: '16 Jul 2010',
    Runtime: '148 min',
    Genre: 'Action, Adventure, Sci-Fi',
    Director: 'Christopher Nolan',
    Writer: 'Christopher Nolan',
    Actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
    Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    Language: 'English, Japanese, French',
    Country: 'United States, United Kingdom',
    Awards: 'Won 4 Oscars. 159 wins & 220 nominations total',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.8/10' },
      { Source: 'Rotten Tomatoes', Value: '87%' },
      { Source: 'Metacritic', Value: '74/100' },
    ],
    Metascore: '74',
    imdbRating: '8.8',
    imdbVotes: '2,658,716',
    imdbID: 'tt1375666',
    Type: 'movie',
    DVD: 'N/A',
    BoxOffice: '$292,587,330',
    Production: 'N/A',
    Website: 'N/A',
    Response: 'True',
  });

test('fetchMovies returns movie data', async () => {
  const movies = await fetchMovies('test', 1, 'movie');
  expect(movies).toHaveLength(1);
  expect(movies[0].Title).toBe('Inception');
});

test('fetchMovieDetails returns detailed movie data', async () => {
  const movie = await fetchMovieDetails('tt1375666');
  expect(movie.Title).toBe('Inception');
  expect(movie.Plot).toBe(
    'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.'
  );
});
