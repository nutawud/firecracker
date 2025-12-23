import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyJWT() {
  const cookieStore = await cookies(); // 👈 ต้อง await
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  return jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
  };
}
