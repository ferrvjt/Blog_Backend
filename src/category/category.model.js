import { Schema, model } from "mongoose";

const Category = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    status: {
        type: Boolean,
        default: true
    }
});

export default model("Category", Category)