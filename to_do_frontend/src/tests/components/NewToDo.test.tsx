import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import ButtonNewTodo from '../../components/NewToDo/ButtonNewTodo';
import { configureStore } from '@reduxjs/toolkit';
import rowReducer from '../../store/slices/rowsSlice';
import paramsReducer from '../../store/slices/paramsSlice';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import * as toDoService from '../../api/toDoService';
import { ToDo } from '../../types/ToDo';
import { Priority } from '../../types/Priority';
import { ThemeProvider } from '../../providers/ThemeProvider';
import { SnackbarProvider } from '../../providers/SnackbarProvider';

const renderWithProviders = (ui: ReactNode) => {
  const store = configureStore({
    reducer: {
      rows: rowReducer,
      params: paramsReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['rows/addRow'],
          ignoredPaths: ['rows.rows'],
        },
      }),
  });

  return render(
    <ThemeProvider>
      <SnackbarProvider>
        <Provider store={store}>{ui}</Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

const newToDo: ToDo = {
  id: 1,
  text: 'test',
  dueDate: null,
  doneFlag: false,
  doneDate: null,
  priority: Priority.HIGH,
  creationTime: new Date(),
};

const mockNewToDo = vi
  .spyOn(toDoService, 'createToDo')
  .mockResolvedValueOnce({
    message: 'success',
    data: newToDo,
  })
  .mockResolvedValueOnce({
    message: 'error',
    error: 'Some error',
  });

describe('New ToDo Button and Form', () => {
  beforeEach(() => renderWithProviders(<ButtonNewTodo />));
  test('Click on button opens a Modal and close with close when clicked outside', () => {
    const button = screen.getByText('Create New Task');

    act(() => {
      fireEvent.click(button);
    });

    const submitButton = screen.getByText('Create Task');
    expect(submitButton).toBeInTheDocument();

    const backdrop = document.querySelector('.MuiBackdrop-root');
    act(() => {
      fireEvent.mouseDown(backdrop as HTMLDivElement);
      fireEvent.mouseUp(backdrop as HTMLDivElement);
      fireEvent.click(backdrop as HTMLDivElement);
    });

    expect(submitButton).not.toBeInTheDocument();
  });

  test('Creating a new todo', async () => {
    const button = screen.getByText('Create New Task');

    act(() => {
      fireEvent.click(button);
    });

    const nameInput = screen.getByLabelText('Task Name');
    act(() => {
      fireEvent.change(nameInput, { target: { value: 'test' } });
    });

    // Open the select dropdown
    const priorityInput = screen.getByLabelText('Priority Level');
    act(() => {
      fireEvent.mouseDown(priorityInput);
    });

    // Click on the HIGH option
    const highOption = screen.getByText('HIGH');
    act(() => {
      fireEvent.click(highOption);
    });

    const submitButton = screen.getByText('Create Task');
    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockNewToDo).toBeCalledTimes(1);
    });
  });

  test('Trying to create a ToDo but got error', async () => {
    const button = screen.getByText('Create New Task');

    act(() => {
      fireEvent.click(button);
    });

    const nameInput = screen.getByLabelText('Task Name');
    act(() => {
      fireEvent.change(nameInput, { target: { value: '' } });
    });

    // Open the select dropdown
    const priorityInput = screen.getByLabelText('Priority Level');
    act(() => {
      fireEvent.mouseDown(priorityInput);
    });

    // Click on the HIGH option
    const highOption = screen.getByText('HIGH');
    act(() => {
      fireEvent.click(highOption);
    });

    const submitButton = screen.getByText('Create Task');
    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockNewToDo).toBeCalledTimes(2);
      expect(screen.getByText('Some error')).toBeDefined();
    });
  });
});
