import { SnackbarCloseReason } from "@mui/material";
import { useState } from "react";

export const useCloseModal = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
  };

  return {
    modalOpen,
    setModalOpen,
    success,
    setSuccess,
    handleClose,
  };
};
