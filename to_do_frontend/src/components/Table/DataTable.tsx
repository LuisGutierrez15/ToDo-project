import { FC } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Alert, Box, Snackbar } from "@mui/material";
import { useFetchToDos, DataTableProps } from "../../hooks/useFetchToDos";
import { getRowClassName } from "../../helpers/styleHelpers";

import { handleSelectionChange } from "../../helpers/handlersHelpers";
import { useDispatch, useSelector } from "react-redux";
import { useCloseModal } from "../../hooks/useCloseModal";
import { cols } from "./cols";
import { selectParams } from "../../store/selectors/paramsSelector";

const DataTable: FC<DataTableProps> = ({
  name,
  priority,
  complete,
  className,
}) => {
  const {
    rows,
    rowCount,
    isLoading,
    paginationModel,
    sortModel,
    selectionModel,
    setPaginationModel,
    setSortModel,
    setSelectionModel,
    setIsLoading,
  } = useFetchToDos({ name, priority, complete });
  const dispatch = useDispatch();
  const { success, setSuccess, handleClose } = useCloseModal();
  const parameters = useSelector(selectParams);
  const columns = cols(setSuccess, setIsLoading, dispatch, parameters);

  return (
    <Box
      sx={{
        height: 500,
        width: "calc(100vw - 3%)",

        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGridPro
        className={className}
        loading={isLoading}
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        checkboxSelection
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        paginationMode="server"
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        onRowSelectionModelChange={(newSelection) => {
          setIsLoading(true);
          handleSelectionChange(
            newSelection,
            setSelectionModel,
            dispatch,
            setIsLoading,
            rows
          );
        }}
        rowSelectionModel={selectionModel}
        getRowClassName={(params) => getRowClassName(params, selectionModel)}
        disableRowSelectionOnClick
      />
      {success && (
        <Snackbar open={success} autoHideDuration={3000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            ToDo successfully updated!
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default DataTable;
