import { FC, useEffect, useState } from "react";
import { ToDo } from "../../types/ToDo";
import { markDone, markUnDone } from "../../api/toDoService";

type TableRowProps = {
  toDo: ToDo;
  isCheckedGeneral: boolean;
};

const TableRow: FC<TableRowProps> = ({ toDo, isCheckedGeneral }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  useEffect(() => {
    if (!isCheckedGeneral && isChecked) setIsChecked(false);
  }, [isCheckedGeneral]);

  useEffect(() => {
    handleIsDone();
  }, [isChecked, isCheckedGeneral]);

  const handleIsDone = async () => {
    if (isChecked) {
      await markDone(toDo.id);
    } else {
      await markUnDone(toDo.id);
    }
  };
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="w-4 p-4">
        <div className="flex items-center">
          <label
            htmlFor={`checkbox-table-search-${toDo.id}`}
            className="sr-only"
          >
            checkbox
          </label>
          <input
            checked={isCheckedGeneral || isChecked || toDo.doneFlag}
            onChange={(e) => setIsChecked(e.target.checked)}
            id={`checkbox-table-search-${toDo.id}`}
            type="checkbox"
            name={`checkbox-${toDo.id}`}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {toDo.text}
      </th>
      <td className="px-6 py-4">{toDo.priority}</td>
      <td className="px-6 py-4">{toDo.dueDate?.toDateString() || "-"}</td>

      <td className="px-6 py-4">
        <div className="space-x-1.5">
          <a
            href="#"
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Edit
          </a>
          <a
            href="#"
            className="font-medium text-red-600 dark:text-red-500 hover:underline"
          >
            Delete
          </a>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
