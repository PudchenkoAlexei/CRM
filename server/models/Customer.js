import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    service: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: "not started" },
}, {
    timestamps: true
})

export default mongoose.model("Customer", CustomerSchema);