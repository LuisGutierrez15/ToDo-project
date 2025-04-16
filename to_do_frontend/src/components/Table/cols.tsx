import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { ToDo } from "../../types/ToDo";
import ButtonEditTodo from "../EditToDo/ButtonEditTodo";
import { Delete } from "@mui/icons-material";
import { handleDeleteRow } from "../../helpers/handlersHelpers";
import { Dispatch, SetStateAction } from "react";
import { UnknownAction } from "@reduxjs/toolkit";
import { Parameters } from "../../types/Parameters";

export const cols = (
  setSuccess: Dispatch<SetStateAction<boolean>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  dispatch: Dispatch<UnknownAction>,
  parameters: Parameters | null
): GridColDef<ToDo>[] => [
  {
    field: "text",
    headerName: "Name",
    flex: 1,
    sortable: false,
  },
  { field: "priority", headerName: "Priority", flex: 1, sortable: true },
  {
    field: "dueDate",
    headerName: "Due Date",
    flex: 1,
    sortable: true,
    valueGetter: (value) => {
      if (!value) {
        return null;
      }
      return new Date(value).toLocaleString();
    },
    renderCell: (params: GridRenderCellParams<ToDo>) => {
      const classNameIfPresent = params.row.dueDate
        ? ""
        : "text-xs text-blue-300";

      return (
        <span className={classNameIfPresent}>
          {params.row.dueDate ? params.value : "Not assigned yet"}
        </span>
      );
    },
  },

  {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 100,
    cellClassName: "actions",
    getActions: (params: GridRowParams<ToDo>) => {
      return [
        <ButtonEditTodo row={params.row} setSuccess={setSuccess} />,
        <GridActionsCellItem
          icon={<Delete />}
          label={`delete-${params.row.id}`}
          onClick={() => {
            setIsLoading(true);
            handleDeleteRow(params.row.id!, dispatch, setIsLoading, parameters);
          }}
          color="inherit"
        />,
      ];
    },
  },
];
