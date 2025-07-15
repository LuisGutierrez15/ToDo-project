import { Modal } from '@mui/material';
import { FC, useState } from 'react';
import EditToDoForm from './EditToDoForm';
import { ToDo } from '../../types/ToDo';
import { Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';

type ButtonEditTodoProps = {
  row: ToDo;
};

const ButtonEditTodo: FC<ButtonEditTodoProps> = ({ row }) => {
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<ToDo>(row);

  return (
    <>
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <EditToDoForm setEditRow={setEditRow} setModalOpen={setEditOpen} row={editRow} />
      </Modal>
      <GridActionsCellItem
        icon={<Edit />}
        label={`edit-${row.id}`}
        disabled={row.doneFlag}
        className='textPrimary'
        onClick={() => {
          setEditOpen(true);
        }}
        color='inherit'
      />
    </>
  );
};

export default ButtonEditTodo;
