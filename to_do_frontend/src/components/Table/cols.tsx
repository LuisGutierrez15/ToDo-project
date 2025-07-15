import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from '@mui/x-data-grid';
import { ToDo } from '../../types/ToDo';
import ButtonEditTodo from '../EditToDo/ButtonEditTodo';
import { Delete } from '@mui/icons-material';
import { handleDeleteRow } from '../../helpers/handlersHelpers';
import { Dispatch, SetStateAction } from 'react';
import { UnknownAction } from '@reduxjs/toolkit';
import { Parameters } from '../../types/Parameters';
import { Typography } from '@mui/material';
import PriorityBadge from './PriorityBadge';
import DueDateChip from './DueDateChip';

export const cols = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  dispatch: Dispatch<UnknownAction>,
  parameters: Parameters | null
): GridColDef<ToDo>[] => [
  {
    field: 'text',
    headerName: '📋 Task Name',
    flex: 1.5,
    minWidth: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams<ToDo>) => (
      <Typography
        variant='body2'
        sx={{
          fontWeight: 500,
          fontSize: '0.875rem',
          color: 'text.primary',
          textDecoration: params.row.doneFlag ? 'line-through' : 'none',
          textDecorationColor: params.row.doneFlag ? 'success.main' : 'transparent',
          opacity: params.row.doneFlag ? 0.7 : 1,
          lineHeight: 1.4,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'priority',
    headerName: '🎯 Priority',
    flex: 0.8,
    minWidth: 120,
    sortable: true,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams<ToDo>) => <PriorityBadge priority={params.value} />,
  },
  {
    field: 'dueDate',
    headerName: '📅 Due Date',
    flex: 1.2,
    minWidth: 160,
    sortable: true,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams<ToDo>) => <DueDateChip task={params.row} />,
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: '⚙️ Actions',
    width: 120,
    headerAlign: 'center',
    cellClassName: 'actions',
    getActions: (params: GridRowParams<ToDo>) => {
      return [
        <ButtonEditTodo row={params.row} key={`edit-${params.row.id}`} />,
        <GridActionsCellItem
          icon={<Delete />}
          label={`delete-${params.row.id}`}
          onClick={() => {
            setIsLoading(true);
            handleDeleteRow(params.row.id!, dispatch, setIsLoading, parameters);
          }}
          color='inherit'
          key={`delete-${params.row.id}`}
          sx={{
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              color: 'error.main',
              transform: 'scale(1.1)',
            },
          }}
        />,
      ];
    },
  },
];
