import { Schema,model } from "mongoose";

const User = Schema({
    name: {
        type: String,
        required: [true,"Name is required."],
        maxLenght: [25,"Cannot be overcome 25 characters"]
    },
    username:{
        type: String,
        unique: true
    },
    email: {
        type: String,
        required:[true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La contrasena es requerida"],
        minLenght: [8, "Cannot overcome 8 characters"]
    },
    profilePicture: {
        type: String
    },
    role:{
        type: String,
        required: true,
        enum: ["ADMIN_ROLE","USER_ROLE"]
    },
    status:{
        type: Boolean,
        default: true
    }
},
    {
        timestamps:true,
        versionKey: false
    }
);

User.methods.toJSON = function(){
    const {__v, password, _id, ...usuario}=this.toObject();
    usuario.uid = _id;
    return usuario;
};

export default model("User", User);