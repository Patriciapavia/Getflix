import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  renderHook,
} from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchMovies from '../components/SearchMovies';
import { useWatchlistStore } from '../store/useWatchlistStore';

vi.mock('../hooks/useFetchMovies', () => ({
  fetchMovies: vi.fn().mockResolvedValue([
    {
      imdbID: 'tt1234567',
      Title: 'Test Movie',
      Year: '2024',
      Poster: 'https://via.placeholder.com/150',
    },
  ]),
}));

vi.mock('../hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useInfiniteQuery: vi.fn().mockReturnValue({
      data: {
        pages: [
          [
            {
              imdbID: 'tt1234567',
              Title: 'Test Movie',
              Year: '2024',
              Poster: 'https://via.placeholder.com/150',
            },
          ],
        ],
      },
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
    }),
  };
});

vi.mock('../store/useWatchlistStore', () => ({
  useWatchlistStore: vi.fn(() => ({
    watchlist: [],
    addToWatchlist: vi.fn(),
    removeFromWatchlist: vi.fn(),
  })),
}));
const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
const renderComponent = () => render(<SearchMovies />, { wrapper });

describe('SearchMovies Component', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity },
      },
    });
  });

  it('renders search input and filter dropdown', () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText('Search for a movie...')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Search for a movie')).toBeInTheDocument();
    expect(screen.getByText('Select Type')).toBeInTheDocument();
  });

  it('updates search query when user types', async () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText('Search for a movie...');
    fireEvent.change(searchInput, { target: { value: 'Batman' } });
    await waitFor(() => expect(searchInput).toHaveValue('Batman'));
  });

  it('displays loading state when fetching movies', async () => {
    vi.mock('@tanstack/react-query', async () => {
      const actual = await vi.importActual('@tanstack/react-query');
      return {
        ...actual,
        useInfiniteQuery: vi.fn().mockReturnValue({
          data: undefined,
          isLoading: true,
        }),
      };
    });
    renderComponent();
    expect(await screen.findByRole('status')).toHaveTextContent(/Loading.../);
  });
});
