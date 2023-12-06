import { Router } from "express";
import { ITodo } from "../models/todo";

const router = Router();

interface IBody {
  text: string;
}
interface IRequestParams {
  todoId: string | number;
}

let todos: ITodo[] = [];

router.get("/", (req, res, next) => {
  res.status(200).json({
    todos,
  });
});

router.post("/todo", (req, res, next) => {
  const body = req.body as IBody;
  const newTodo: ITodo = {
    id: new Date().getTime(),
    text: body.text,
  };

  todos.push(newTodo);

  res.status(201).json({
    message: "Create Todo successfully",
  });
});

router.put("/todo/:todoId", (req, res, next) => {
  const params = req.params;
  const tid = Number(params.todoId);
  const body = req.body as IBody;

  const todoIndex = todos.findIndex((item) => item.id === tid);

  if (todoIndex > -1) {
    todos[todoIndex] = {
      ...todos[todoIndex],
      text: body.text,
    };
  }

  res.status(404).json({
    code: 4,
    message: "Could not find todo for this id",
  });
});

router.delete("/todo/:todoId", (req, res, next) => {
  const params = req.params;
  const tid = Number(params.todoId);

  todos = todos.filter((item) => item.id !== tid);

  res.status(200).json({
    code: 0,
    data: todos,
  });
});

export default router;
