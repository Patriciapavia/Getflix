import { Routes, Route } from 'react-router-dom';
import SearchMovies from './components/SearchMovies';
import MovieDetails from './components/MovieDetails';

function App() {
  return (
    <div className='min-h-screen bg-gray-100 text-gray-900'>
      <h1 className='text-center text-3xl font-bold p-4'>Getflix</h1>
      <Routes>
        <Route path='/' element={<SearchMovies />} />
        <Route path='/movie/:id' element={<MovieDetails />} />
      </Routes>
    </div>
  );
}

export default App;
