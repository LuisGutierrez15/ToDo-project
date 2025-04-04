import { FC, useState } from "react";
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

const StatusSelection: FC = () => {
  const [value, setValue] = useState<number | undefined>(undefined);
  //console.log(value);
  return <Dropdown onChange={setValue} options={options} label="State" />;
};

export default StatusSelection;
