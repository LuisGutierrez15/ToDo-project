import { Dispatch, FC, SetStateAction } from "react";

type TableHeaderProps = {
  checkAll: boolean;
  setCheckAll: Dispatch<SetStateAction<boolean>>;
};

const TableHeader: FC<TableHeaderProps> = ({ checkAll, setCheckAll }) => {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="p-4">
          <div className="flex items-center">
            <label htmlFor="checkbox-all-search" className="sr-only">
              checkbox
            </label>
            <input
              onChange={(e) => setCheckAll(e.target.checked)}
              id="checkbox-all-search"
              name="checkbox-all"
              type="checkbox"
              checked={checkAll}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </th>
        <th scope="col" className="px-6 py-3">
          Name
        </th>
        <th scope="col" className="px-6 py-3">
          Priority
        </th>
        <th scope="col" className="px-6 py-3">
          Due Date
        </th>
        <th scope="col" className="px-6 py-3">
          Action
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
