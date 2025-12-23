import mongoose, { Schema, models } from "mongoose";

const FirecrackerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
        unit: {
            type: String,
            default: "ลัง",
        },
        image: {
            type: String, // เก็บเป็น URL หรือ path ของรูป
            required: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        description: String,
    },
    { timestamps: true }
);

export default models.Firecracker || mongoose.model("Firecracker", FirecrackerSchema);