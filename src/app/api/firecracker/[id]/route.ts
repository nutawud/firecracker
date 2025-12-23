import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Firecracker from "@/models/Firecracker";
import { verifyJWT } from "@/lib/auth";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
/* ================= GET: รายตัว ================= */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const data = await Firecracker.findById(id);

  if (!data) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

/* ================= PUT: แก้ไขสินค้า ================= */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await verifyJWT();
  await connectDB();

  const formData = await request.formData();

  const update: any = {
    name: formData.get("name"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    unit: formData.get("unit"),
    description: formData.get("description"),
  };

  const file = formData.get("image") as File | null;
  if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const dir = path.join(process.cwd(), "public/uploads/Firecracker");
    fs.mkdirSync(dir, { recursive: true });

    const filename = `${Date.now()}-${file.name}`;
    fs.writeFileSync(path.join(dir, filename), buffer);

    update.image = `/uploads/Firecracker/${filename}`;
  }

  const data = await Firecracker.findByIdAndUpdate(id, update, { new: true });

  return NextResponse.json(data);
}


/* ================= DELETE: ลบสินค้า ================= */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await verifyJWT();
  await connectDB();

  const data = await Firecracker.findByIdAndDelete(id);

  if (data?.image) {
    const filePath = path.join(process.cwd(), "public", data.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  return NextResponse.json({ success: true });
}
