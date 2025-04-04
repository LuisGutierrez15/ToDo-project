import { FC, useState } from "react";
import Input from "./Input";
import StatusSelection from "./StatusSelection";
import PrioritySelection from "./PrioritySelection";
import Button from "./Button";

const Header: FC = () => {
  const [text, setText] = useState<string>("");
  const handleOnSubmit = () => {};
  const handleOnChange = (value: any) => setText(value);

  return (
    <header className="w-full items-center">
      <div className="flex-col m-6 p-6 rounded-lg shadow-md border-2 border-amber-800">
        <div className="flex flex-row items-center space-x-3 p-2">
          <Input
            placeHolder="text"
            value={text}
            type="text"
            onSubmit={handleOnSubmit}
            onChange={handleOnChange}
          >
            <label htmlFor="input-text">Name</label>
          </Input>
        </div>
        <div className="flex-row flex justify-between items-end">
          <div className="flex-col">
            <PrioritySelection />
            <StatusSelection />
          </div>
          <Button onClick={() => {}}>Search</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
