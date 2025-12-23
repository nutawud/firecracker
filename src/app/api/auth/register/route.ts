import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();

  const { fname, lname, email, password } = await req.json();

  const exist = await User.findOne({ email });
  if (exist) {
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    fname,
    lname,
    email,
    password: hashed,
  });

  return NextResponse.json({ message: "Register success" });
}
