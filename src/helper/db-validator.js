import Role from "../role/role.model.js";
import User from "../user/user.model.js";

export const existEmail = async(correo ='')=>{

    const existeEmail = await User.findOne({correo});

    if(existeEmail){
        throw new Error(`El correo ${correo} ya esta registrado`)
    }
}

export const existUserById= async(id= '')=>{
    const existeUsuario = await User.findById(id);

    if(!existeUsuario){
        throw new Error(`El ID ${id} no existe`);
    }
}

export const existRole = async (role = '') => {
    const existeRol = await Role.findOne({role});

    if(!existeRol){
        throw new Error(`El rol ${role} no existe en la base de datos`);
    }
}