import { GridRowSelectionModel } from "@mui/x-data-grid";
import { deleteToDo, getToDos, markDone, markUnDone } from "../api/toDoService";
import { ToDo } from "../types/ToDo";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { UnknownAction } from "@reduxjs/toolkit";
import { deleteRow, updateRow } from "../store/slices/rowsSlice";
import { SelectChangeEvent } from "@mui/material";
import { Priority } from "../types/Priority";
import { Parameters } from "../types/Parameters";

const handleSelectionChange = (
  newSelection: GridRowSelectionModel,
  setSelectionModel: Dispatch<SetStateAction<GridRowSelectionModel>>,
  dispatch: Dispatch<UnknownAction>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  rows: ToDo[]
) => {
  rows
    .filter((row) => row.doneFlag)
    .filter((row) => !newSelection.includes(row.id!))
    .map(async (t) => {
      const response = await markUnDone(t.id!);
      if (response.message === "success") {
        const updated: ToDo = { ...t, doneFlag: !t.doneFlag };
        dispatch(updateRow(updated));
      }
    });
  rows
    .filter((row) => !row.doneFlag)
    .filter((row) => newSelection.includes(row.id!))
    .map(async (t) => {
      const response = await markDone(t.id!);
      if (response.message === "success") {
        const updated: ToDo = { ...t, doneFlag: !t.doneFlag };
        dispatch(updateRow(updated));
      }
    });

  setSelectionModel(newSelection);
  setIsLoading(false);
};

const handlePreSelectedRows = (toDos: ToDo[]) => {
  const doneToDos = toDos.filter((t: ToDo) => t.doneFlag);
  const ids = doneToDos.map((t: ToDo) => t.id) as GridRowSelectionModel;
  return ids;
};

const handleDeleteRow = async (
  id: number,
  dispatch: Dispatch<UnknownAction>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  params: Parameters
) => {
  const response = await deleteToDo(id);
  if (response.message === "success") {
    const refresh = await getToDos(params);
    dispatch(
      deleteRow({
        rows: refresh.data,
        rowsCount: refresh.total,
      })
    );
    setIsLoading(false);
  }
};

const handlePriorityChange = (
  event: SelectChangeEvent,
  setRow: Dispatch<SetStateAction<ToDo>>
) => {
  setRow((prev) =>
    prev
      ? { ...prev, priority: event.target.value as unknown as Priority }
      : prev
  );
};
const handleDueDateChange = (
  newValue: string,
  setRow: Dispatch<SetStateAction<ToDo>>
) => {
  setRow((prev) => (prev ? { ...prev, dueDate: newValue || null } : prev));
};

const handleTextChange = (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setRow: Dispatch<SetStateAction<ToDo>>
) => {
  setRow((prev) => (prev ? { ...prev, text: event.target.value } : prev));
};

const handleClearError = (setError: Dispatch<SetStateAction<string>>) => {
  setError("");
};

export {
  handleDeleteRow,
  handleDueDateChange,
  handlePreSelectedRows,
  handlePriorityChange,
  handleSelectionChange,
  handleTextChange,
  handleClearError,
};
