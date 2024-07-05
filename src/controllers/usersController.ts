import client from "../db/db";

export const getAllUsers = async () => {
  try {
    const result = await client.query("SELECT * FROM health_check");
    return result.rows;
  } catch (error) {
    console.error("Error executing PostgreSQL query:", error);
    return "Error";
  }
};
