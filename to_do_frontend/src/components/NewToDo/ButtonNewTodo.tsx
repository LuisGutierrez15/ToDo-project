import { Modal } from '@mui/material';
import { FC, useState } from 'react';
import NewToDoForm from './NewToDoForm';

const ButtonNewTodo: FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <NewToDoForm setModalOpen={setModalOpen} />
      </Modal>

      <div className='flex justify-center'>
        <button
          onClick={() => setModalOpen(true)}
          className='group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-lg'
        >
          <span className='mr-3 text-xl group-hover:rotate-90 transition-transform duration-300'>
            +
          </span>
          <span>Create New Task</span>
        </button>
      </div>
    </>
  );
};

export default ButtonNewTodo;
