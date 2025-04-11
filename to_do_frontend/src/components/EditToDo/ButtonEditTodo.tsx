import { Modal } from "@mui/material";
import { Dispatch, FC, SetStateAction, useState } from "react";
import EditToDoForm from "./EditToDoForm";
import { ToDo } from "../../types/ToDo";
import { Edit } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";

type ButtonEditTodoProps = {
  row: ToDo;
  setSuccess: Dispatch<SetStateAction<boolean>>;
};
const ButtonEditTodo: FC<ButtonEditTodoProps> = ({ row, setSuccess }) => {
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<ToDo>(row);

  return (
    <>
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <EditToDoForm
          setSuccess={setSuccess}
          setEditRow={setEditRow}
          setModalOpen={setEditOpen}
          row={editRow}
        />
      </Modal>
      <GridActionsCellItem
        icon={<Edit />}
        label="Edit"
        disabled={row.doneFlag}
        className="textPrimary"
        onClick={() => {
          setEditOpen(true);
        }}
        color="inherit"
      />
    </>
  );
};

export default ButtonEditTodo;
