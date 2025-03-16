import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import MovieDetails from '../components/MovieDetails';

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

describe('MovieDetails Component', () => {
  let queryClient: QueryClient;

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

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );

  it('renders loading state initially', async () => {
    vi.mocked(useQuery).mockReturnValue({
      isLoading: true,
      isFetching: true,
      isPending: true,
      isError: false,
      isSuccess: false,
      isFetched: false,
      isFetchedAfterMount: false,
      data: undefined,
      error: null,
      refetch: vi.fn(),
    } as unknown as UseQueryResult);

    render(<MovieDetails />, { wrapper });
    expect(screen.getByRole('status')).toHaveTextContent(/Loading.../);
  });
});
