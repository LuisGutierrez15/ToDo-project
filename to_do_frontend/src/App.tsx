import Body from "./components/Body";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ButtonNewTodo from "./components/NewToDo/ButtonNewTodo";
import DataTable from "./components/Table/DataTable";
import { useState } from "react";

function App() {
  const [text, setText] = useState<string>("");
  const [priority, setPriority] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <Header
        setText={setText}
        setPriority={setPriority}
        setStatus={setStatus}
      />
      <Body>
        <ButtonNewTodo />
        <DataTable name={text} priority={priority} complete={status} />
      </Body>
      <Footer />
    </div>
  );
}

export default App;
