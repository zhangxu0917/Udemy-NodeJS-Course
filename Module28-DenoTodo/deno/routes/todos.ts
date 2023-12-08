import { Router } from "https://deno.land/x/oak/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

import { getDb } from "../helpers/db_client.ts";

const router = new Router();

interface ITodo {
  id?: ObjectId;
  text: string;
  status: number;
}

router.get("/todos", async (ctx) => {
  const todos = await getDb().collection("tasks").find().toArray();

  const transformedTodos = todos.map((todo) => {
    return {
      id: todo._id.toString(),
      text: todo.text,
      status: todo.status,
    };
  });

  ctx.response.body = {
    code: 0,
    message: "Success",
    data: {
      todos: transformedTodos,
    },
  };
});

router.post("/todos", async (ctx) => {
  let data = ctx.request.body({
    type: "json",
  });

  data = await data.value;

  const newTask: ITodo = {
    text: data.text,
    status: 0,
  };

  const id = await getDb().collection("tasks").insertOne(newTask);

  newTask.id = id.$oid;

  ctx.response.body = {
    code: 0,
    message: "Success",
    data: {
      ...newTask,
    },
  };
});

router.put("/todos/:todoId", async (ctx) => {
  const todoId = ctx.params.todoId;

  let data = ctx.request.body({
    type: "json",
  });

  data = await data.value;
  console.log("post todos");

  const todo = await getDb()
    .collection("tasks")
    .updateOne(
      { _id: new ObjectId(todoId) },
      {
        $set: {
          text: data.text,
          status: data.status,
        },
      }
    );

  ctx.response.body = {
    code: 0,
    message: "Success",
    data: {
      ...todo,
    },
  };
});

router.delete("/todos/:todoId", async (ctx) => {
  const todoId = ctx.params.todoId;

  await getDb()
    .collection("tasks")
    .deleteOne({
      _id: new ObjectId(todoId),
    });

  ctx.response.body = {
    code: 0,
    message: "Success",
  };
});

export default router;
