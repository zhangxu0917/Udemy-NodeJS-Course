import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

interface ITodo {
  id: number | string;
  text: string;
}

let todos: ITodo[] = [];

router.get("/todos", (ctx) => {
  console.log("get todos");
  ctx.response.body = {
    code: 0,
    message: "Success",
    data: {
      todos,
    },
  };
});

router.post("/todos", async (ctx) => {
  console.log("post todos");

  let data = ctx.request.body({
    type: "json",
  });
  data = await data.value;

  const newTdodo: ITodo = {
    id: new Date().getTime() + "",
    text: data.text,
  };

  todos.push(newTdodo);

  ctx.response.body = {
    code: 0,
    message: "Success",
    data: {
      todo: newTdodo,
    },
  };
});

router.put("/todos/:todoId", async (ctx) => {
  const todoId = ctx.params.todoId;

  const data = ctx.request.body({
    type: "json",
  });
  const result = await data.value;

  console.log(result.text);

  const todoIndex = todos.findIndex((o) => o.id === todoId);
  todos[todoIndex] = {
    ...todos[todoIndex],
    text: result.text,
  };

  ctx.response.body = {
    code: 0,
    message: "Todo updated.",
    data: {
      todo: todos[todoIndex],
    },
  };
});

router.delete("/todos/:todoId", (ctx) => {
  const todoId = ctx.params.todoId;

  todos = todos.filter((item) => item.id !== todoId);

  ctx.response.body = {
    code: 0,
    message: "Todo deleted.",
    data: {
      todoId,
    },
  };
});

export default router;
