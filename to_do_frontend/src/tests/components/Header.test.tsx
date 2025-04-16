import { fireEvent, render, screen } from "@testing-library/react";
import Header from "../../components/Header";

describe("Header", () => {
  const mockSetText = vi.fn();
  const mockSetStatus = vi.fn();
  const mockSetPriority = vi.fn();

  beforeEach(() =>
    render(
      <Header
        setPriority={mockSetPriority}
        setStatus={mockSetStatus}
        setText={mockSetText}
      />
    )
  );
  test("Should change the value of the textfield and reset it when search button is clicked", () => {
    const input = screen.getByLabelText("Name");
    fireEvent.change(input, { target: { value: "change" } });
    expect((input as HTMLInputElement).value).toBe("change");
    const button = screen.getByText("Search");
    fireEvent.click(button);
    expect((input as HTMLInputElement).value).toBe("");
  });
});
