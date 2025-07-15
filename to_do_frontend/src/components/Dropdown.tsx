import { ChangeEvent, FC } from 'react';
import { Option } from '../types/Option';

type DropdownProps = {
  label: string;
  options: Option[];
  value?: number | null;
  onChange: (value: number | null) => void;
};

const Dropdown: FC<DropdownProps> = ({ label, options, value, onChange }) => {
  return (
    <div className='w-full'>
      <label
        htmlFor={`dropdown-${label}`}
        className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'
      >
        {label}
      </label>
      <div className='relative'>
        <select
          id={`dropdown-${label}`}
          value={value ?? ''}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            const selectedValue = e.target.value;
            onChange(selectedValue === '' ? null : parseInt(selectedValue));
          }}
          className='w-full appearance-none rounded-xl border-2 border-gray-200/70 dark:border-gray-600/70 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm py-3 px-4 pr-10 text-gray-900 dark:text-gray-100 text-sm font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer shadow-sm hover:shadow-md'
        >
          <option value='' className='bg-white dark:bg-gray-700'>
            All
          </option>
          {options.map((o: Option, i: number) => (
            <option className='bg-white dark:bg-gray-700' key={i} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
          <svg
            className='w-4 h-4 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
