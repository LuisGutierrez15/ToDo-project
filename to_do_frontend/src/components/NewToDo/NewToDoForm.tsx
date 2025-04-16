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
import { createToDo } from "../../api/toDoService";
import { useDispatch } from "react-redux";
import { addRow } from "../../store/slices/rowsSlice";
import {
  handleClearError,
  handleDueDateChange,
  handlePriorityChange,
  handleTextChange,
} from "../../helpers/handlersHelpers";

type NewToDoFormProps = {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setSuccess: Dispatch<SetStateAction<boolean>>;
};

const NewToDoForm: FC<NewToDoFormProps> = ({ setModalOpen, setSuccess }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string>("");
  const [newRow, setNewRow] = useState<ToDo>({
    text: "",
    dueDate: null,
    priority: undefined,
  });

  const handleSubmit = async () => {
    const response = await createToDo(newRow);
    if (response.message === "success") {
      setModalOpen(false);
      dispatch(addRow(response.data));
      setSuccess(true);
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
        New To Do
      </h2>
      {error.length > 0 && (
        <h2 className="mb-2 text-red-500 text-shadow font-sans text-sm">
          {error}
        </h2>
      )}
      <TextField
        label="Name"
        fullWidth
        onChange={(event) => handleTextChange(event, setNewRow)}
        onFocus={() => handleClearError(setError)}
        sx={{ mb: 2 }}
        error={
          error.length > 0 &&
          (newRow.text.length == 0 || newRow.text.length > 120)
        }
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="priority-label">Priority</InputLabel>
        <Select
          onFocus={() => handleClearError(setError)}
          labelId="priority-label"
          label="Priority"
          value={(newRow.priority as unknown as string) ?? ""}
          onChange={(event) => handlePriorityChange(event, setNewRow)}
          error={error.length > 0 && newRow.priority == undefined}
        >
          <MenuItem hidden />
          {Object.values(Priority).map(
            (value) =>
              typeof value === "number" && (
                <MenuItem value={value} key={value}>
                  {Priority[value]}
                </MenuItem>
              )
          )}
        </Select>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Due Date (optional)"
          disablePast
          onChange={(newValue) =>
            handleDueDateChange(newValue?.toISOString() || "", setNewRow)
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
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
};

export default NewToDoForm;
