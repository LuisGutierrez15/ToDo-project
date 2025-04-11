import { GridRowParams, GridRowSelectionModel } from "@mui/x-data-grid";
import { ToDo } from "../types/ToDo";

const timeBetweenColor = (a: Date, b: Date) => {
  const diff = b.getTime() - a.getTime();
  const diffInDays = diff / (1000 * 3600 * 24);
  if (diffInDays <= 7) {
    return "bg-red-200";
  } else if (diffInDays > 7 && diffInDays <= 15) {
    return "bg-yellow-200";
  } else {
    return "bg-green-200";
  }
};

const getRowClassName = (
  params: GridRowParams<ToDo>,
  selectionModel: GridRowSelectionModel
) => {
  const isSelected = selectionModel.includes(params.id);
  const actualRow = params.row;
  const className = isSelected
    ? "line-through"
    : actualRow.dueDate
    ? timeBetweenColor(
        new Date(actualRow.creationTime!),
        new Date(actualRow.dueDate)
      )
    : "bg-gray-100";
  return className;
};

export { getRowClassName };
