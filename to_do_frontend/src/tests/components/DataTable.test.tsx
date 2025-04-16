import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import DataTable from "../../components/Table/DataTable";
import * as toDoService from "../../api/toDoService";
import { configureStore } from "@reduxjs/toolkit";
import rowReducer from "../../store/slices/rowsSlice";
import paramsReducer from "../../store/slices/paramsSlice";
import { Provider } from "react-redux";
import { ReactNode } from "react";
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
const testRow: ToDo = {
  id: 1,
  text: "test",
  dueDate: null,
  doneFlag: false,
  doneDate: null,
  priority: Priority.HIGH,
  creationTime: new Date(),
};
const getToDosMock = vi.spyOn(toDoService, "getToDos").mockResolvedValue({
  message: "sucess",
  data: [testRow],
  total: 1,
});

const markDone = vi
  .spyOn(toDoService, "markDone")
  .mockResolvedValue({ message: "success", data: true });

const markUnDone = vi
  .spyOn(toDoService, "markUnDone")
  .mockResolvedValue({ message: "success", data: true });

const updateToDoMock = vi
  .spyOn(toDoService, "updateToDo")
  .mockResolvedValueOnce({
    message: "sucess",
    data: true,
  })
  .mockResolvedValueOnce({
    message: "error",
    data: false,
  });

const deleteToDoMock = vi.spyOn(toDoService, "deleteToDo").mockResolvedValue({
  message: "sucess",
  data: true,
});

describe("DataTable with API service", () => {
  let testCount = 1;
  beforeEach(() => {
    renderWithStore(<DataTable name={null} priority={null} complete={null} />);
  });

  test("Should display columns headers and a row", () => {
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeDefined();
    expect(
      screen.getByRole("columnheader", { name: "Priority" })
    ).toBeDefined();
    expect(
      screen.getByRole("columnheader", { name: "Due Date" })
    ).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Actions" })).toBeDefined();
    expect(getToDosMock).toBeCalledTimes(testCount++);
  });

  test("Should display a row", async () => {
    await waitFor(() => {
      const row = screen.getByRole("row", { name: /test/i });
      expect(row).toBeInTheDocument();
    });
    expect(getToDosMock).toBeCalledTimes(testCount++);
  });

  test("Should call edit end point and see the changes", async () => {
    expect(getToDosMock).toBeCalledTimes(testCount++);
    await waitFor(() => {
      const editButton = screen.getByLabelText(`edit-${testRow.id}`);
      fireEvent.click(editButton);
      const inputName = screen.getByLabelText("Name");
      fireEvent.change(inputName, { target: { value: "updated" } });
      const submitButton = screen.getByRole("submit");
      fireEvent.click(submitButton);
      expect(updateToDoMock).toBeCalledTimes(1);
    });
    expect(screen.getByText("updated")).toBeDefined();
  });

  test("Should call edit end point and see don't the changes because errors", async () => {
    expect(getToDosMock).toBeCalledTimes(testCount++);
    await waitFor(() => {
      const editButton = screen.getByLabelText(`edit-${testRow.id}`);
      fireEvent.click(editButton);
      const inputName = screen.getByLabelText("Name");
      fireEvent.change(inputName, { target: { value: "" } });
      const submitButton = screen.getByRole("submit");
      fireEvent.click(submitButton);
      expect(updateToDoMock).toBeCalledTimes(2);
    });
    expect(screen.getByText("Some fields were incorrect")).toBeDefined();
  });

  test("Should mark done and undone when clicked", async () => {
    expect(getToDosMock).toBeCalledTimes(testCount++);
    await waitFor(() => {
      const row = screen.getByRole("row", { name: /test/i });
      const checkbox = within(row).getByRole("checkbox");
      fireEvent.click(checkbox);
      expect(markDone).toBeCalledTimes(1);
    });
    await waitFor(() => {
      const row = screen.getByRole("row", { name: /test/i });
      const checkbox = within(row).getByRole("checkbox");
      fireEvent.click(checkbox);
      expect(markUnDone).toBeCalledTimes(1);
    });
  });

  test("Should call delete end point", async () => {
    expect(getToDosMock).toBeCalledTimes(testCount++);
    await waitFor(() => {
      const deleteButton = screen.getByLabelText(`delete-${testRow.id}`);
      fireEvent.click(deleteButton);
      expect(deleteToDoMock).toBeCalledTimes(1);
    });
  });
});
