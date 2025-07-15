import { FC } from 'react';
import { Option } from '../types/Option';
import { Status } from '../types/Status';
import Dropdown from './Dropdown';

const options: Option[] = [
  {
    value: Status.DONE,
    label: 'Done',
  },
  {
    value: Status.UNDONE,
    label: 'Undone',
  },
];

type StatusSelectionProps = {
  value?: number | null;
  setValue: (value: number | null) => void;
};

const StatusSelection: FC<StatusSelectionProps> = ({ value, setValue }) => {
  return <Dropdown onChange={setValue} options={options} label='State' value={value} />;
};

export default StatusSelection;
