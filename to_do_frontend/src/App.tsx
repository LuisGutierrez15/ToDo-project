import Body from "./components/Body";
import Table from "./components/Table/Table";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ButtonNewTodo from "./components/NewToDo/ButtonNewTodo";

function App() {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <Header />
      <Body>
        <ButtonNewTodo />
        <Table />
      </Body>
      <Footer />
    </div>
  );
}

export default App;
