import { FC, useState } from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

const Table: FC = () => {
  const [checkAll, setCheckAll] = useState(false);
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <TableHeader checkAll={checkAll} setCheckAll={setCheckAll} />
        <TableBody allChecked={checkAll} />
      </table>
    </div>
  );
};

export default Table;
