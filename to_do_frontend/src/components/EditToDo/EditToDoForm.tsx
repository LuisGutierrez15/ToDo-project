import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Priority } from "../../types/Priority";
import { ToDo } from "../../types/ToDo";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import { useDispatch } from "react-redux";

import {
  handleDueDateChange,
  handlePriorityChange,
  handleTextChange,
} from "../../helpers/handlersHelpers";
import { updateToDo } from "../../api/toDoService";
import { updateRow } from "../../store/slices/rowsSlice";

type EditToDoFormProps = {
  setEditRow: Dispatch<SetStateAction<ToDo>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  row: ToDo;
  setSuccess: Dispatch<SetStateAction<boolean>>;
};

const EditToDoForm: FC<EditToDoFormProps> = ({
  setModalOpen,
  setEditRow,
  row,
  setSuccess,
}) => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string>("");

  const handleSubmitEdit = async () => {
    const response = await updateToDo(row.id!, row);
    if (response.data) {
      dispatch(updateRow(row));
      setSuccess(true);
      setModalOpen(false);
    } else {
      setError("Some fields were incorrect");
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "Menu",
        boxShadow: 24,
        p: 6,
        borderRadius: 2,
        flex: 1,
      }}
    >
      <h2 className="mb-2 text-2xl text-gray-600 text-shadow font-stretch-75%">
        Edit To Do
      </h2>
      {error.length > 0 && (
        <h2 className="mb-2 text-red-500 text-shadow font-sans text-sm">
          {error}
        </h2>
      )}
      <TextField
        label="Name"
        fullWidth
        value={row.text}
        onChange={(event) => handleTextChange(event, setEditRow)}
        sx={{ mb: 2 }}
        error={
          error.length > 0 && (row.text.length == 0 || row.text.length > 120)
        }
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="priority-label">Priority</InputLabel>
        <Select
          labelId="priority-label"
          label="Priority"
          value={row.priority as unknown as string}
          onChange={(event) => handlePriorityChange(event, setEditRow)}
          error={error.length > 0 && row.priority == undefined}
        >
          {Object.values(Priority).map(
            (value) =>
              typeof value === "string" && (
                <MenuItem value={value} key={value}>
                  {value}
                </MenuItem>
              )
          )}
        </Select>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Due Date (optional)"
          disablePast
          value={row.dueDate ? dayjs(row.dueDate) : null}
          onChange={(newValue) =>
            handleDueDateChange(newValue?.toISOString() || "", setEditRow)
          }
          slotProps={{
            field: { clearable: true },
          }}
        />
      </LocalizationProvider>

      <Button
        sx={{
          mt: 2,
        }}
        role="submit"
        variant="contained"
        color="inherit"
        onClick={handleSubmitEdit}
      >
        Submit
      </Button>
    </Box>
  );
};

export default EditToDoForm;
