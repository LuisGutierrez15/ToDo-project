import { GridRowSelectionModel } from '@mui/x-data-grid';
import { deleteToDo, getToDos, markDone, markUnDone } from '../api/toDoService';
import { ToDo } from '../types/ToDo';
import { ChangeEvent, Dispatch, RefObject, SetStateAction } from 'react';
import { UnknownAction } from '@reduxjs/toolkit';
import { deleteRow, updateRow } from '../store/slices/rowsSlice';
import { SelectChangeEvent } from '@mui/material';
import { Priority } from '../types/Priority';
import { Parameters } from '../types/Parameters';
import { isAPIResponse, isPaginatedAPIResponse } from '../utils/typeGuards';

const handleSelectionChange = (
  newSelection: GridRowSelectionModel,
  setSelectionModel: Dispatch<SetStateAction<GridRowSelectionModel>>,
  dispatch: Dispatch<UnknownAction>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  rows: ToDo[]
) => {
  rows
    .filter(row => row.doneFlag)
    .filter(row => !newSelection.includes(row.id!))
    .map(async t => {
      const response = await markUnDone(t.id!);
      if (isAPIResponse(response) && response.data) {
        const updated: ToDo = { ...t, doneFlag: !t.doneFlag };
        dispatch(updateRow(updated));
      }
    });
  rows
    .filter(row => !row.doneFlag)
    .filter(row => newSelection.includes(row.id!))
    .map(async t => {
      const response = await markDone(t.id!);
      if (isAPIResponse(response) && response.data) {
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
  params: Parameters | null
) => {
  const response = await deleteToDo(id);
  if (isAPIResponse(response) && response) {
    const refresh = await getToDos(params);
    if (isPaginatedAPIResponse(refresh)) {
      dispatch(
        deleteRow({
          rows: refresh.data, // todos are directly in refresh.data
          rowsCount: refresh.total, // total count is at refresh.total
        })
      );
    }
    setIsLoading(false);
  }
};

const handlePriorityChange = (event: SelectChangeEvent, setRow: Dispatch<SetStateAction<ToDo>>) => {
  setRow(prev => (prev ? { ...prev, priority: event.target.value as unknown as Priority } : prev));
};
const handleDueDateChange = (newValue: string, setRow: Dispatch<SetStateAction<ToDo>>) => {
  setRow(prev => (prev ? { ...prev, dueDate: newValue || null } : prev));
};

const handleTextChange = (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setRow: Dispatch<SetStateAction<ToDo>>
) => {
  setRow(prev => (prev ? { ...prev, text: event.target.value } : prev));
};

const handleClearError = (setError: Dispatch<SetStateAction<string>>) => {
  setError('');
};

const handleOnSubmit = (
  inputRef: RefObject<HTMLInputElement | null>,
  setText: Dispatch<SetStateAction<string>>
) => {
  if (inputRef.current) {
    setText(inputRef.current.value);
    inputRef.current.value = '';
  }
};

export {
  handleDeleteRow,
  handleDueDateChange,
  handlePreSelectedRows,
  handlePriorityChange,
  handleSelectionChange,
  handleTextChange,
  handleClearError,
  handleOnSubmit,
};
