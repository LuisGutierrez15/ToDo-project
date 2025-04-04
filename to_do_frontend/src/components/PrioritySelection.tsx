import { FC, useState } from "react";
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

const PrioritySelection: FC = () => {
  const [value, setValue] = useState<number | undefined>(undefined);
  //console.log(value && Priority[value]);
  return <Dropdown onChange={setValue} options={options} label="Priority" />;
};

export default PrioritySelection;
