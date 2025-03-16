import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchMovies from './components/SearchMovies';
import MovieDetails from './components/MovieDetails';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <div className='min-h-screen bg-white text-black dark:bg-black dark:text-white'>
        <header className='flex justify-between items-center p-4'>
          <h1 className='text-3xl font-bold'>Getflix</h1>
          <ThemeToggle />
        </header>

        <Routes>
          <Route path='/' element={<SearchMovies />} />
          <Route path='/movie/:id' element={<MovieDetails />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
