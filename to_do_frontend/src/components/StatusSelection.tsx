import { Dispatch, FC, SetStateAction } from "react";
import { Option } from "../types/Option";
import { Status } from "../types/Status";
import Dropdown from "./Dropdown";

const options: Option[] = [
  {
    value: Status.DONE,
    label: "Done",
  },
  {
    value: Status.UNDONE,
    label: "Undone",
  },
];

type StatusSelectionProps = {
  setValue: Dispatch<SetStateAction<number | null>>;
};

const StatusSelection: FC<StatusSelectionProps> = ({ setValue }) => {
  return <Dropdown onChange={setValue} options={options} label="State" />;
};

export default StatusSelection;
