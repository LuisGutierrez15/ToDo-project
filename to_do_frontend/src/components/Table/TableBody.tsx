import { FC, useEffect, useState } from "react";
import { ToDo } from "../../types/ToDo";
import TableRow from "./TableRow";
import { getToDos } from "../../api/toDoService";
import { Parameters } from "../../types/Parameters";

type TableBodyProps = {
  allChecked: boolean;
  params?: Parameters;
};

const TableBody: FC<TableBodyProps> = ({ allChecked, params }) => {
  const [toDos, setToDos] = useState<ToDo[]>([]);

  useEffect(() => {
    const getData = async () => {
      setToDos(await getToDos(params));
    };

    getData();
  }, []);
  return (
    <tbody>
      {toDos.map((toDo: ToDo, i: number) => (
        <TableRow isCheckedGeneral={allChecked} toDo={toDo} key={i} />
      ))}
    </tbody>
  );
};

export default TableBody;
