import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

let db;

export const connect = async () => {
  const client = new MongoClient();
  await client.connect("mongodb://127.0.0.1:27017");

  db = client.database("deno_todos");
};

export const getDb = () => {
  return db;
};
