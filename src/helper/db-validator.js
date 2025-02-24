import User from "../user/user.model.js";

export const existenteEmail = async(correo ='')=>{

    const existeEmail = await User.findOne({correo});

    if(existeEmail){
        throw new Error(`El correo ${correo} ya esta registrado`)
    }
}

export const existeUsuarioById= async(id= '')=>{
    const existeUsuario = await User.findById(id);

    if(!existeUsuario){
        throw new Error(`El ID ${id} no existe`);
    }
}