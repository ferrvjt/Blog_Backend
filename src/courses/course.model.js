import { Schema, model } from "mongoose";

const CourseSchemma = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: [true,'Name was registred yet']
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    }
});

export default model('Course', CourseSchemma)