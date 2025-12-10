import mongoose from "mongoose";
const { Schema } = mongoose;

const DealSchema = new Schema(
    {
        discount: { type: String, required: true },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HomeCategory",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Deal", DealSchema);
