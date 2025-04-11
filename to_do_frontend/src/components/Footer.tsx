import { FC, useEffect, useState } from "react";
import { Stats } from "../types/Stats";
import { getStats } from "../api/toDoService";
import { Priority } from "../types/Priority";
import { formatMinutesToStringDDhhmm } from "../helpers/formatHelpers";
import { useSelector } from "react-redux";
import { selectAllToDos } from "../store/selectors/rowsSelector";
const Footer: FC = () => {
  const [stats, setStats] = useState<Stats>();
  const rows = useSelector(selectAllToDos);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getStats();
      setStats(response.data);
    };
    fetchData();
  }, [rows]);

  let total = 0;
  const values =
    stats &&
    Object.entries(stats)
      .sort(
        ([a], [b]) =>
          Object.values(Priority).indexOf(a) -
          Object.values(Priority).indexOf(b)
      )
      .map(([k, v], i) => {
        total += v;
        return (
          <div className="justify-between flex flex-row px-12" key={i}>
            <h1>{`${k}:`}</h1>
            <h2>{formatMinutesToStringDDhhmm(v)}</h2>
          </div>
        );
      });

  return (
    <footer className="w-full items-center">
      <div className="flex flex-row m-6 rounded-lg shadow-md border-2 border-gray-200 justify-evenly items-center">
        <div className="p-6rounded-lg flex-col text-center">
          <h1 className="text-lg font-bold">Average time to finish tasks: </h1>
          <h3>{formatMinutesToStringDDhhmm(total / 3)}</h3>
        </div>

        <div className="p-6 rounded-lg">
          <h1 className="text-lg font-bold">
            Average time to finish tasks by priority:
          </h1>
          {values}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
