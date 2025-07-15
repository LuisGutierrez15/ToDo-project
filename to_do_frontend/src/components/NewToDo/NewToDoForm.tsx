import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Priority } from '../../types/Priority';
import { ToDo } from '../../types/ToDo';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createToDo } from '../../api/toDoService';
import { useDispatch } from 'react-redux';
import { addRow } from '../../store/slices/rowsSlice';
import { isSuccessResponse, extractErrorMessage, extractAPIData } from '../../utils/typeGuards';
import {
  handleClearError,
  handleDueDateChange,
  handlePriorityChange,
  handleTextChange,
} from '../../helpers/handlersHelpers';
import { useSnackbar } from '../../hooks/useSnackbar';
import { transformPriorityValue } from '../../utils/dataTransformers';

type NewToDoFormProps = {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

const NewToDoForm: FC<NewToDoFormProps> = ({ setModalOpen }) => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [error, setError] = useState<string>('');
  const [newRow, setNewRow] = useState<ToDo>({
    text: '',
    dueDate: null,
    priority: undefined,
  });

  // Define priority options to avoid enum iteration issues
  const priorityOptions = [
    { value: Priority.HIGH, label: 'HIGH' },
    { value: Priority.MEDIUM, label: 'MEDIUM' },
    { value: Priority.LOW, label: 'LOW' },
  ];

  const handleSubmit = async () => {
    const response = await createToDo(newRow);
    if (isSuccessResponse(response)) {
      setModalOpen(false);
      const newTodo = extractAPIData(response);
      if (newTodo) {
        dispatch(addRow(newTodo));
      }
      showSnackbar('Task created successfully!', 'success');
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
        <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
          Create New Task
        </h2>
        <p className='text-gray-600 dark:text-gray-400 text-sm'>Add a new task to your todo list</p>
      </div>

      {error.length > 0 && (
        <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
          <p className='text-red-600 dark:text-red-400 text-sm font-medium'>{error}</p>
        </div>
      )}

      <TextField
        label='Task Name'
        fullWidth
        onChange={event => handleTextChange(event, setNewRow)}
        onFocus={() => handleClearError(setError)}
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
        error={error.length > 0 && (newRow.text.length == 0 || newRow.text.length > 120)}
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
          onFocus={() => handleClearError(setError)}
          labelId='priority-label'
          label='Priority Level'
          value={
            newRow.priority?.toString() ?? transformPriorityValue(newRow.priority)?.toString() ?? ''
          }
          onChange={event => handlePriorityChange(event, setNewRow)}
          error={error.length > 0 && newRow.priority == undefined}
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
          onChange={newValue => handleDueDateChange(newValue?.toISOString() || '', setNewRow)}
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
          onClick={handleSubmit}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
            },
          }}
        >
          Create Task
        </Button>
      </div>
    </Box>
  );
};

export default NewToDoForm;
