import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import client, { connectDB } from "./db/db";
import { getAllUsers } from "./controllers/usersController";
connectDB();
const app = new Elysia();
app.use(cors());
app.get("/", () => "hello 🦊");

app.get("/users", async () => {
  try {
    const result = await getAllUsers();
    return result;
  } catch (error) {
    console.error("Error executing PostgreSQL query:", error);
    return "Error";
  }
});

app.post(
  "/user",
  async ({ body: { name }, error }) => {
    if (name === "Otto") return error(400, "Bad Request");
    try {
      await client.query(`INSERT INTO health_check (name) VALUES ($1)`, [name]);
      return { message: "User profile created successfully", name };
    } catch (error) {
      console.error("Error inserting into PostgreSQL:", error);
      return error;
    }
  },
  {
    body: t.Object({
      name: t.String(),
    }),
  }
);

app.listen(8080);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
