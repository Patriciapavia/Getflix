# Getflix 🎬 - Movie Search App

Getflix is a React 19 application that allows users to search for movies, view detailed information, and manage a personal watchlist.

## 🚀 Features

✔️ **Movie Search** - Search for movies using the OMDb API
✔️ **Infinite Scroll** - Loads more results as you scroll
✔️ **Movie Details Page** - View detailed information about each movie
✔️ **Watchlist** - Add and remove movies from your watchlist
✔️ **Dark Mode** - Toggle between light and dark themes
✔️ **Debounced Search** - Reduces API calls when typing
✔️ **Persisted Search Results** - Retain search results when navigating back
✔️ **Responsive Design** - Optimized for all screen sizes

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **React Router** for navigation
- **React Query** for API data fetching & caching
- **Zustand** - State management for watchlist and search persistence
- **Framer Motion** for smooth animations
- **Vitest + React Testing Library** for unit testing
- **Tailwind CSS** for styling

## Installation & Setup

# Clone the repository

git clone https://github.com/Patriciapavia/Getflix.git
cd Getflix

# Install dependencies

npm install

## Set Up Environment Variables

Create a .env file in the root directory and add your OMDb API Key:

VITE_OMDB_API_KEY="320f6ab2"

## Start the Development Server

npm run dev
