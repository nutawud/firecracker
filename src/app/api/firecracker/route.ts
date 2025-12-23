import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Firecracker from "@/models/Firecracker";
import { verifyJWT } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    await verifyJWT();
    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock") || 0);
    const unit = formData.get("unit") as string;
    const description = formData.get("description") as string;

    const file = formData.get("image") as File | null;
    let imagePath = "";

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads/firecracker");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `${Date.now()}-${file.name}`;
      const fullPath = path.join(uploadDir, filename);

      fs.writeFileSync(fullPath, buffer);
      imagePath = `/uploads/firecracker/${filename}`;
    }

    const Firecrackers = await Firecracker.create({
      name,
      price,
      stock,
      unit,
      description,
      image: imagePath,
    });

    return NextResponse.json(Firecrackers, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function GET() {
  try {
    await verifyJWT(); // แค่เช็คว่ามี token
    await connectDB();

    const Firecrackers = await Firecracker.find().sort({ createdAt: -1 });

    return NextResponse.json(Firecrackers);
  } catch (err) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}

