import { useEffect, useState, createContext, useCallback } from "react";
import { message } from "antd";
import SubmitForm from "./form";
import TaskList from "./list";

export const TodosContext = createContext();

const HomePage = () => {
  let [todos, setTodos] = useState([]);
  const [messageApi, messageContextHolder] = message.useMessage();

  const loadTodos = useCallback(() => {
    fetch("http://localhost:8080/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0) {
          setTodos(res.data.todos);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <TodosContext.Provider
      value={{
        loadTodos,
        messageApi,
        messageContextHolder,
      }}
    >
      <div className="page-container">
        <SubmitForm />
        <TaskList todos={todos} />
      </div>
      <>{messageContextHolder}</>
    </TodosContext.Provider>
  );
};

export default HomePage;
