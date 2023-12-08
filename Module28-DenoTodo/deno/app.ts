import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import todosRoutes from "./routes/todos.ts";
import { connect } from "./helpers/db_client.ts";

connect();

const app = new Application();

app.use(oakCors()); // Enable CORS for All Routes

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

console.log("app is running on port 8080");

await app.listen({ port: 8080 });
