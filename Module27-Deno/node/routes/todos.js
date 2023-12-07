const { Router } = require("express");

const router = Router();

let todos = [];

router.get("/", (req, res, next) => {
  res.json({
    code: 0,
    data: {
      todos,
    },
  });
});

router.post("/", (req, res, next) => {
  const newTodo = {
    id: new Date().getTime(),
    text: req.body.text,
  };
  todos.push(newTodo);

  res.json({
    code: 0,
    message: "Todo created.",
    data: {
      ...newTodo,
    },
  });
});

router.put("/:todoId", (req, res, next) => {
  const todoId = req.params.todoId;
  const todoIndex = todos.findIndex((todo) => todo.id === todoId);

  if (todoIndex >= -1) {
    todos[todoIndex].text = req.body.text;
  }

  res.json({
    code: 0,
    message: "Todo updated.",
    data: {
      ...todos[todoIndex],
    },
  });
});

router.delete("/:todoId", (req, res, next) => {
  const todoId = req.params.todoId;

  todos = todos.filter((todo) => todo.id !== todoId);

  res.json({
    code: 0,
    message: "Todo deleted.",
    data: {
      todoId,
    },
  });
});

module.exports = router;
