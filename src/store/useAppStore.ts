import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { Movie } from '../types/movie';

interface AppState {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: string) => void;
  searchResults: Movie[];
  setSearchResults: (movies: Movie[]) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        watchlist: [],
        addToWatchlist: (movie) => {
          set({ watchlist: [...get().watchlist, movie] });
        },
        removeFromWatchlist: (id) => {
          set({
            watchlist: get().watchlist.filter((movie) => movie.imdbID !== id),
          });
        },
        searchResults: [],
        setSearchResults: (movies) => set({ searchResults: movies }),
      }),
      { name: 'app-storage' }
    )
  )
);
