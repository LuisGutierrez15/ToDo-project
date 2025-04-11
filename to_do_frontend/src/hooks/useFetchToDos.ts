import { useEffect, useState } from "react";
import {
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { Status } from "../types/Status";
import { getToDos } from "../api/toDoService";
import { Priority } from "../types/Priority";
import { useDispatch, useSelector } from "react-redux";
import { setRows } from "../store/slices/rowsSlice";
import { setParams } from "../store/slices/paramsSlice";
import { selectAllToDos } from "../store/selectors/rowsSelector";
import { handlePreSelectedRows } from "../helpers/handlersHelpers";
import { selectParams } from "../store/selectors/paramsSelector";

export type DataTableProps = {
  name: string | null;
  priority: number | null;
  complete: number | null;
  className?: string;
};

export const useFetchToDos = ({ name, priority, complete }: DataTableProps) => {
  const params = useSelector(selectParams);
  const dispatch = useDispatch();
  const rowsInfo = useSelector(selectAllToDos);
  const rowCount = rowsInfo.rowsCount;
  const rows = rowsInfo.rows;
  const [isLoading, setIsLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  useEffect(() => {
    const { page, pageSize } = paginationModel;
    const parameters = {
      page: page,
      size: pageSize,
      complete: complete ? Status[complete] : null,
      name: name && name?.length > 0 ? name : null,
      priority: priority ? Priority[priority] : null,
      sortByPriority: sortModel.find((s) => s.field == "priority")?.sort,
      sortByDueDate: sortModel.find((s) => s.field == "dueDate")?.sort,
    };
    dispatch(setParams(parameters));
  }, [sortModel, paginationModel, name, priority, complete]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getToDos(params);
      dispatch(
        setRows({
          rows: response.data,
          rowsCount: response.total,
          paginationModel: paginationModel,
          sortModel: sortModel,
        })
      );
      const ids = handlePreSelectedRows(response.data);
      setSelectionModel(ids);
    };
    fetchData();
    setIsLoading(false);
  }, [params]);

  useEffect(() => {
    if (rowsInfo.paginationModel) setPaginationModel(rowsInfo.paginationModel);
  }, [rowsInfo.paginationModel]);

  return {
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
  };
};
