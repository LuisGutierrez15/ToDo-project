import { render, screen, waitFor } from "@testing-library/react";
import * as toDoService from "../../api/toDoService";
import Footer from "../../components/Footer";
import { configureStore } from "@reduxjs/toolkit";
import rowReducer from "../../store/slices/rowsSlice";
import paramsReducer from "../../store/slices/paramsSlice";
import { Provider } from "react-redux";
import { ReactNode } from "react";

const renderWithStore = (ui: ReactNode) => {
  const store = configureStore({
    reducer: {
      rows: rowReducer,
      params: paramsReducer,
    },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};
const getMetricsMock = vi.spyOn(toDoService, "getStats").mockResolvedValueOnce({
  message: "success",
  data: {
    HIGH: 10,
    MEDIUM: 60,
    LOW: 50,
  },
});

describe("Metrics", () => {
  beforeEach(() => {
    renderWithStore(<Footer />);
  });

  test("Should display the metrics by priority and an average", async () => {
    await waitFor(() => {
      // HIGH
      expect(screen.getByText("10 minutes")).toBeDefined();
      // MEDIUM
      expect(screen.getByText("1 hours 0 minutes")).toBeDefined();
      // LOW
      expect(screen.getByText("50 minutes")).toBeDefined();
      // AVG
      expect(screen.getByText("40 minutes")).toBeDefined();

      expect(getMetricsMock).toBeCalledTimes(1);
    });
  });
});
