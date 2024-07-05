import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { Client } from "pg";
import { cors } from "@elysiajs/cors";

const client = new Client({
  host: Bun.env.DB_HOST,
  port: parseInt(Bun.env.DB_PORT || "5432", 10), // Default port 5432 if DB_PORT is undefined
  user: Bun.env.DB_USER,
  password: Bun.env.DB_PASSWORD,
  database: Bun.env.DB_NAME,
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL successfully");
  } catch (err) {
    console.error("Connection error", err);
    process.exit(1); // Exit the process if connection fails
  }
};

connectDB();

const app = new Elysia();
app.use(cors());

app.get("/", () => "hello 🦊");

app.get("/users", async () => {
  try {
    const result = await client.query("SELECT * FROM health_check");
    return result.rows;
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
