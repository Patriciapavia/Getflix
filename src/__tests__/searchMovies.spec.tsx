import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

import { describe, it, vi, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchMovies from '../components/SearchMovies';

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
const renderComponent = () => render(<SearchMovies />, { wrapper });

describe('SearchMovies Component', () => {
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
