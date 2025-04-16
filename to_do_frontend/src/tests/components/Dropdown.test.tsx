import Dropdown from "../../components/Dropdown";
import { fireEvent, render, screen } from "@testing-library/react";
import { Priority } from "../../types/Priority";
import { Option } from "../../types/Option";

describe("Dropdown", () => {
  const options: Option[] = [
    {
      value: Priority.HIGH,
      label: "High",
    },
    {
      value: Priority.MEDIUM,
      label: "Medium",
    },
    {
      value: Priority.LOW,
      label: "Low",
    },
  ];
  const handleOnChange = vi.fn();
  beforeEach(() => {
    render(
      <Dropdown label="Priority" options={options} onChange={handleOnChange} />
    );
  });

  test("Should display priority label and options", () => {
    expect(screen.getByText("Priority")).toBeDefined();
    expect(screen.getByText("High")).toBeDefined();
    expect(screen.getByText("Medium")).toBeDefined();
    expect(screen.getByText("Low")).toBeDefined();
  });

  test("Should call onChange with correct value when option selected", () => {
    const select = screen.getByLabelText("Priority");
    fireEvent.change(select, { target: { value: Priority.HIGH } });
    expect(handleOnChange).toHaveBeenCalledWith("0");
    fireEvent.change(select, { target: { value: Priority.LOW } });
    expect(handleOnChange).toHaveBeenCalledWith("2");
    fireEvent.change(select, { target: { value: Priority.MEDIUM } });
    expect(handleOnChange).toHaveBeenCalledWith("1");
  });
});
