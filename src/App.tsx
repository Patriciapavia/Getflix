import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchMovies from './components/SearchMovies';
import MovieDetails from './components/MovieDetails';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import { useAppStore } from './store/useAppStore';
import { FaBookmark } from 'react-icons/fa';
import { Link } from 'react-router-dom';
function App() {
  const { watchlist } = useAppStore();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <ThemeProvider>
      <div className='min-h-screen bg-white text-black dark:bg-black dark:text-white'>
        <header className='flex justify-between items-center p-4 relative'>
          <h1 className='text-3xl font-bold'>Getflix</h1>
          <div className='flex flex-col items-center gap-2'>
            <ThemeToggle />
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className='p-2 border rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white transition-all flex items-center gap-2 relative'
            >
              <FaBookmark className='text-xl' /> Watchlist ({watchlist.length})
            </button>
            {showDropdown && (
              <div className='absolute top-full mt-2 w-56 bg-white dark:bg-gray-800 shadow-md rounded-md p-2'>
                {watchlist.length === 0 ? (
                  <p className='text-gray-500 text-sm'>
                    No movies in watchlist
                  </p>
                ) : (
                  <ul>
                    {watchlist.map((movie) => (
                      <li
                        key={movie.imdbID}
                        className='text-sm text-gray-900 dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'
                      >
                        <Link
                          to={`/movie/${movie.imdbID}`}
                          className='block text-sm hover:text-gray-900 dark:hover:text-white'
                        >
                          {movie.Title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
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
