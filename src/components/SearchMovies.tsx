import React from 'react';

const SearchMovies = () => {
  return (
    <div className='p-4 max-w-4xl mx-auto'>
      <input
        type='text'
        placeholder='Search for a movie...'
        className='w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
    </div>
  );
};

export default SearchMovies;
