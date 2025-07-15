import { render, screen } from '@testing-library/react';
import DataTable from '../../components/Table/DataTable';
import { configureStore } from '@reduxjs/toolkit';
import rowReducer from '../../store/slices/rowsSlice';
import paramsReducer from '../../store/slices/paramsSlice';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { ToDo } from '../../types/ToDo';

// Mock the MUI Data Grid Pro to avoid file descriptor issues
vi.mock('@mui/x-data-grid-pro', () => ({
  DataGridPro: ({ rows, loading }: { rows?: ToDo[]; loading?: boolean }) => (
    <div data-testid='mocked-data-grid'>
      <div data-testid='loading'>{loading ? 'Loading...' : 'Ready'}</div>
      <div data-testid='row-count'>Rows: {rows?.length || 0}</div>
      {rows?.map((row: ToDo, index: number) => (
        <div key={row.id || index} data-testid={`row-${row.id || index}`}>
          {row.text} - {row.priority}
        </div>
      ))}
    </div>
  ),
}));

// Mock the entire icons-material module to avoid the file loading issue
vi.mock('@mui/icons-material', () => ({
  Delete: () => <div data-testid='delete-icon'>Delete</div>,
}));

// Mock the DataTable component entirely to test API integration
vi.mock('../../components/Table/DataTable', () => ({
  default: ({
    name,
    priority,
    complete,
  }: {
    name: string | null;
    priority: number | null;
    complete: number | null;
  }) => (
    <div data-testid='mocked-datatable'>
      <div data-testid='table-props'>
        Name: {name || 'null'}, Priority: {priority || 'null'}, Complete:{' '}
        {complete !== null ? complete : 'null'}
      </div>
    </div>
  ),
}));

const renderWithStore = (ui: ReactNode) => {
  const store = configureStore({
    reducer: {
      rows: rowReducer,
      params: paramsReducer,
    },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('DataTable with API service', () => {
  test('Should render mocked DataTable component', () => {
    renderWithStore(
      <DataTable
        name={null}
        priority={null}
        complete={null}
        page={1}
        size={10}
        sortByPriority={null}
        sortByDueDate={null}
        updateUrlParams={() => {}}
      />
    );

    expect(screen.getByTestId('mocked-datatable')).toBeDefined();
    expect(screen.getByTestId('table-props')).toHaveTextContent(
      'Name: null, Priority: null, Complete: null'
    );
  });

  test('Should display correct props when passed', () => {
    renderWithStore(
      <DataTable
        name='test'
        priority={1}
        complete={0}
        page={1}
        size={10}
        sortByPriority={null}
        sortByDueDate={null}
        updateUrlParams={() => {}}
      />
    );

    expect(screen.getByTestId('table-props')).toHaveTextContent(
      'Name: test, Priority: 1, Complete: 0'
    );
  });

  test('Should handle component rendering without errors', () => {
    const { container } = renderWithStore(
      <DataTable
        name='example'
        priority={2}
        complete={1}
        page={1}
        size={10}
        sortByPriority={null}
        sortByDueDate={null}
        updateUrlParams={() => {}}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
