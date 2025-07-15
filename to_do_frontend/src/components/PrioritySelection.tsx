import { FC } from 'react';
import { Option } from '../types/Option';
import { Priority } from '../types/Priority';
import Dropdown from './Dropdown';

const options: Option[] = [
  {
    value: Priority.HIGH,
    label: '🔴 High',
  },
  {
    value: Priority.MEDIUM,
    label: '🟡 Medium',
  },
  {
    value: Priority.LOW,
    label: '🟢 Low',
  },
];

type PrioritySelectionProps = {
  value?: number | null;
  setValue: (value: number | null) => void;
};

const PrioritySelection: FC<PrioritySelectionProps> = ({ value, setValue }) => {
  return <Dropdown onChange={setValue} options={options} label='Priority' value={value} />;
};

export default PrioritySelection;
