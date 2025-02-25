import { Schema, model } from "mongoose";

const Opinion = Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user',
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
    opn:{
        type: String, 
        required: [true, 'Must have a body']
    },
    likes:{
        type: Number,
        min: [0, 'Must be a real number']
    },
    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'user',
        bodyComment: String
    }],
    status:{
        type: Boolean,
        default: true
    },
})

export default model("Opinion", Opinion)