import { FC } from "react";

import { formatMinutesToStringDDhhmm } from "../helpers/formatHelpers";
import { useFetchStats } from "../hooks/useFetchStats";

const Footer: FC = () => {
  const result = useFetchStats();
  let total = 0;
  const values = result?.map(([k, v], i) => {
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
