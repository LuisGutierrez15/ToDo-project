import { ChangeEvent, FC } from "react";
import { Option } from "../types/Option";

type DropdownProps = {
  label: string;
  options: Option[];
  onChange: (value: number) => void;
};

const Dropdown: FC<DropdownProps> = ({ label, options, onChange }) => {
  return (
    <>
      <div className="p-2 flex-row flex items-center text-center justify-evenly">
        <label
          htmlFor={`dropdown-${label}`}
          className="mx-4 block text-base font-medium text-shadow dark:text-white dark:bg-amber-900 min-w-1/2"
        >
          {label}
        </label>
        <div className="relative z-20">
          <select
            id={`dropdown-${label}`}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onChange(e.target.value as unknown as number)
            }
            className="cursor-pointer relative z-20 w-fit appearance-none rounded-lg border border-stroke dark:border-gray-300 bg-transparent py-[10px] pr-9 pl-1 text-gray-400 outline-none transition focus:border-gray-500 active:border-gray-400 disabled:cursor-default disabled:bg-gray-200"
          >
            <option value={undefined} className="dark:bg-dark-2">
              All
            </option>
            {options.map((o: Option, i: number) => (
              <option className="dark:bg-dark-2" key={i} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-gray-400"></span>
        </div>
      </div>
    </>
  );
};

export default Dropdown;
