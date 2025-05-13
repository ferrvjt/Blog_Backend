import { Schema, model } from "mongoose";

const PostSchema = Schema({
    user:{
        type: String,
        required: [true, 'User is required']
    },
    cat:{
        type: Schema.Types.ObjectId,
        ref: 'category',
        required:[true, 'Must have a category']
    },
    hdr:{
        type: String, 
        required: [true, 'Must have a header']  
    },
    body:{
        type: String, 
        required: [true, 'Must have a body']
    },
    comments:[{
        user: {
            type: String,
            required: [true, 'User name is required']
        },
        bodyComment: {
            type: String,
            required: [true, 'Comment body is required']
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    date:{
        type:Date,
        default: Date.now
    },
    status:{
        type: Boolean,
        default: true
    },
})

export default model("Post", PostSchema)