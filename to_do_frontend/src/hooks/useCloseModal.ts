import { SnackbarCloseReason } from '@mui/material';
import { useEffect, useState } from 'react';

export const useCloseModal = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccess(false);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
        setSuccess(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return {
    modalOpen,
    setModalOpen,
    success,
    setSuccess,
    handleClose,
  };
};
