import { Dispatch, FC, SetStateAction } from "react";
import { Option } from "../types/Option";
import { Priority } from "../types/Priority";
import Dropdown from "./Dropdown";

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

type PrioritySelectionProps = {
  setValue: Dispatch<SetStateAction<number | null>>;
};

const PrioritySelection: FC<PrioritySelectionProps> = ({ setValue }) => {
  return <Dropdown onChange={setValue} options={options} label="Priority" />;
};

export default PrioritySelection;
