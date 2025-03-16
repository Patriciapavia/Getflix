import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import MovieDetails from '../components/MovieDetails';

vi.mock('../hooks/useFetchMovies', () => ({
  fetchMovieDetails: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'tt1234567' }),
  };
});

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

describe('MovieDetails Component', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );

  it('renders loading state initially', async () => {
    vi.mocked(useQuery).mockReturnValue({ isLoading: true, data: undefined });
    render(<MovieDetails />, { wrapper });
    expect(screen.getByRole('status')).toHaveTextContent(/Loading.../);
  });

  it('renders back to search link', async () => {
    vi.mocked(useQuery).mockReturnValue({ isLoading: false, data: {} });
    render(<MovieDetails />, { wrapper });
    expect(
      screen.getByRole('link', { name: /Back to Search/i })
    ).toBeInTheDocument();
  });
});
