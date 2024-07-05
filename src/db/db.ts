import { Client } from "pg";

const client = new Client({
  host: Bun.env.DB_HOST,
  port: parseInt(Bun.env.DB_PORT || "5432", 10),
  user: Bun.env.DB_USER,
  password: Bun.env.DB_PASSWORD,
  database: Bun.env.DB_NAME,
});

export async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL successfully");
  } catch (err) {
    console.error("Connection error", err);
    process.exit(1);
  }
}

export default client;
