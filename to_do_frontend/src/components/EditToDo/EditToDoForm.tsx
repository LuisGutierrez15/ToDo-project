import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Priority } from '../../types/Priority';
import { ToDo } from '../../types/ToDo';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';

import {
  handleDueDateChange,
  handlePriorityChange,
  handleTextChange,
} from '../../helpers/handlersHelpers';
import { updateToDo } from '../../api/toDoService';
import { updateRow } from '../../store/slices/rowsSlice';
import { isSuccessResponse, extractErrorMessage } from '../../utils/typeGuards';
import { useSnackbar } from '../../hooks/useSnackbar';
import { transformPriorityValue } from '../../utils/dataTransformers';

type EditToDoFormProps = {
  setEditRow: Dispatch<SetStateAction<ToDo>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  row: ToDo;
};

const EditToDoForm: FC<EditToDoFormProps> = ({ setModalOpen, setEditRow, row }) => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [error, setError] = useState<string>('');

  // Define priority options to avoid enum iteration issues
  const priorityOptions = [
    { value: Priority.HIGH, label: 'HIGH' },
    { value: Priority.MEDIUM, label: 'MEDIUM' },
    { value: Priority.LOW, label: 'LOW' },
  ];

  const handleSubmitEdit = async () => {
    const response = await updateToDo(row.id!, row);
    if (isSuccessResponse(response)) {
      dispatch(updateRow(row));
      showSnackbar('Task updated successfully!', 'success');
      setModalOpen(false);
    } else {
      setError(extractErrorMessage(response));
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 450 },
        maxWidth: 500,
        bgcolor: 'background.paper',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        p: { xs: 4, sm: 6 },
        border: '1px solid rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2'>
          Edit Task
        </h2>
        <p className='text-gray-600 dark:text-gray-400 text-sm'>Update your task details</p>
      </div>

      {error.length > 0 && (
        <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
          <p className='text-red-600 dark:text-red-400 text-sm font-medium'>{error}</p>
        </div>
      )}

      <TextField
        label='Task Name'
        fullWidth
        value={row.text}
        onChange={event => handleTextChange(event, setEditRow)}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(59, 130, 246, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgb(59, 130, 246)',
            },
          },
        }}
        error={error.length > 0 && (row.text.length == 0 || row.text.length > 120)}
      />

      <FormControl
        fullWidth
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        }}
      >
        <InputLabel id='priority-label'>Priority Level</InputLabel>
        <Select
          labelId='priority-label'
          label='Priority Level'
          value={row.priority?.toString() ?? transformPriorityValue(row.priority)?.toString() ?? ''}
          onChange={event => handlePriorityChange(event, setEditRow)}
          error={error.length > 0 && row.priority == undefined}
        >
          <MenuItem value='' disabled>
            <em>Select priority</em>
          </MenuItem>
          {priorityOptions.map(option => (
            <MenuItem value={option.value.toString()} key={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label='Due Date (optional)'
          disablePast
          value={row.dueDate ? dayjs(row.dueDate) : null}
          onChange={newValue => handleDueDateChange(newValue?.toISOString() || '', setEditRow)}
          sx={{
            width: '100%',
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
            },
          }}
          slotProps={{
            field: { clearable: true },
          }}
        />
      </LocalizationProvider>

      <div className='flex gap-3 pt-2'>
        <Button
          fullWidth
          variant='outlined'
          onClick={() => setModalOpen(false)}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            borderColor: 'rgba(0, 0, 0, 0.2)',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.3)',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          variant='contained'
          onClick={handleSubmitEdit}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            background: 'linear-gradient(45deg, #7c3aed 30%, #8b5cf6 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #6d28d9 30%, #7c3aed 90%)',
            },
          }}
        >
          Update Task
        </Button>
      </div>
    </Box>
  );
};

export default EditToDoForm;
