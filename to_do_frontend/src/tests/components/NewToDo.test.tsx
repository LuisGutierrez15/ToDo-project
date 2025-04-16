import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ButtonNewTodo from "../../components/NewToDo/ButtonNewTodo";
import { configureStore } from "@reduxjs/toolkit";
import rowReducer from "../../store/slices/rowsSlice";
import paramsReducer from "../../store/slices/paramsSlice";
import { Provider } from "react-redux";
import { ReactNode } from "react";
import * as toDoService from "../../api/toDoService";
import { ToDo } from "../../types/ToDo";
import { Priority } from "../../types/Priority";
const renderWithStore = (ui: ReactNode) => {
  const store = configureStore({
    reducer: {
      rows: rowReducer,
      params: paramsReducer,
    },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

const newToDo: ToDo = {
  id: 1,
  text: "test",
  dueDate: null,
  doneFlag: false,
  doneDate: null,
  priority: Priority.HIGH,
  creationTime: new Date(),
};

const mockNewToDo = vi
  .spyOn(toDoService, "createToDo")
  .mockResolvedValueOnce({
    message: "success",
    data: newToDo,
  })
  .mockResolvedValueOnce({
    message: "error",
    data: null,
  });

describe("New ToDo Button and Form", () => {
  beforeEach(() => renderWithStore(<ButtonNewTodo />));
  test("Click on button opens a Modal and close with close when clicked outside", () => {
    const button = screen.getByText("New To Do");
    fireEvent.click(button);
    const submitButton = screen.getByRole("submit");
    expect(submitButton).toBeInTheDocument();
    const backdrop = document.querySelector(".MuiBackdrop-root");
    fireEvent.mouseDown(backdrop as HTMLDivElement);
    fireEvent.mouseUp(backdrop as HTMLDivElement);
    fireEvent.click(backdrop as HTMLDivElement);
    expect(submitButton).not.toBeInTheDocument();
  });

  test("Creating a new todo", () => {
    const button = screen.getByText("New To Do");
    fireEvent.click(button);
    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "test" } });
    const priorityInput = screen.getByLabelText("Priority");
    fireEvent.change(priorityInput, "HIGH");
    const submitButton = screen.getByRole("submit");
    fireEvent.click(submitButton);
    expect(mockNewToDo).toBeCalledTimes(1);
  });

  test("Trying to create a ToDo but got error", async () => {
    const button = screen.getByText("New To Do");
    fireEvent.click(button);
    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "" } });
    const priorityInput = screen.getByLabelText("Priority");
    fireEvent.change(priorityInput, "HIGH");
    const submitButton = screen.getByRole("submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNewToDo).toBeCalledTimes(2);
      expect(screen.getByText("Some fields were incorrect")).toBeDefined();
    });
  });
});
