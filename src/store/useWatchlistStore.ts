import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { Movie } from '../types/movie';

interface WatchlistState {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: string) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
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
      }),
      { name: 'watchlist-storage' }
    )
  )
);
