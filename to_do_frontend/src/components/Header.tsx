import { Dispatch, FC, SetStateAction, useRef, KeyboardEvent } from "react";

import StatusSelection from "./StatusSelection";
import PrioritySelection from "./PrioritySelection";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { handleOnSubmit } from "../helpers/handlersHelpers";

type HeaderProps = {
  setText: Dispatch<SetStateAction<string>>;
  setStatus: Dispatch<SetStateAction<number | null>>;
  setPriority: Dispatch<SetStateAction<number | null>>;
};

const Header: FC<HeaderProps> = ({ setText, setPriority, setStatus }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleEnterKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleOnSubmit(inputRef, setText);
    }
  };
  return (
    <header className="w-full items-center">
      <div className="flex-col m-6 p-6 rounded-lg shadow-md border-2 border-gray-200">
        <div className="flex flex-row items-center p-2">
          <TextField
            inputRef={inputRef}
            fullWidth
            id="filled-basic"
            label="Name"
            variant="filled"
            color="info"
            onKeyDown={handleEnterKeyDown}
          />
        </div>
        <div className="sm:flex-row flex justify-between sm:items-center flex-col">
          <div className="flex">
            <PrioritySelection setValue={setPriority} />
            <StatusSelection setValue={setStatus} />
          </div>
          <Button
            color="info"
            variant="contained"
            onClick={() => handleOnSubmit(inputRef, setText)}
          >
            Search
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
