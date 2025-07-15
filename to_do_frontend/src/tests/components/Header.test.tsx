import { fireEvent, render, screen } from '@testing-library/react';
import Header from '../../components/Header';
import { DEFAULT_FILTERS } from '../../hooks/useUrlParams';
import { ThemeProvider } from '../../providers/ThemeProvider';

describe('Header', () => {
  const mockUpdateUrlParams = vi.fn();
  const mockClearFilters = vi.fn();
  const mockFilters = DEFAULT_FILTERS;

  beforeEach(() => {
    mockUpdateUrlParams.mockClear();
    mockClearFilters.mockClear();

    render(
      <ThemeProvider>
        <Header
          filters={mockFilters}
          updateUrlParams={mockUpdateUrlParams}
          clearFilters={mockClearFilters}
          hasActiveFilters={false}
        />
      </ThemeProvider>
    );
  });

  test('Should change the value of the textfield and call updateUrlParams when search button is clicked', () => {
    const input = screen.getByLabelText('Search your tasks...');
    fireEvent.change(input, { target: { value: 'change' } });
    expect((input as HTMLInputElement).value).toBe('change');

    const button = screen.getByText('Search');
    fireEvent.click(button);

    expect(mockUpdateUrlParams).toHaveBeenCalledWith({ name: 'change', page: 0 });
    // Note: Input value is no longer cleared after search for better UX with URL params
    expect((input as HTMLInputElement).value).toBe('change');
  });

  test('Should show clear button when hasActiveFilters is true', () => {
    render(
      <ThemeProvider>
        <Header
          filters={mockFilters}
          updateUrlParams={mockUpdateUrlParams}
          clearFilters={mockClearFilters}
          hasActiveFilters={true}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Clear All')).toBeInTheDocument();
    expect(screen.getByText('Clear search')).toBeInTheDocument();
  });

  test('Should call clearFilters when clear button is clicked', () => {
    render(
      <ThemeProvider>
        <Header
          filters={mockFilters}
          updateUrlParams={mockUpdateUrlParams}
          clearFilters={mockClearFilters}
          hasActiveFilters={true}
        />
      </ThemeProvider>
    );

    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);

    expect(mockClearFilters).toHaveBeenCalledTimes(1);
  });
});
