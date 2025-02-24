import { hash, verify } from 'argon2';
import Usuario from '../user/user.model.js';
import  {generarJWT} from '../helper/generate-jwt.js';

export const register = async(req, res) => {

    try {
        const data = req.body;
        
        let profilePicture = req.file ? req.file.filename : null;
        const encryptedPassword = await hash (data.password);
        
        const user = await Usuario.create({
            name: data.name,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            profilePicture
        })

        return res.status(201).json({
            message: "User registred succesfully",
            userDetails:{
                user: user.email
            }
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "User registration failed",
            error: error.message
        });
    }
}

export const login = async(req, res) => {

    const {email, password, username} = req.body;

    try {
        const lowerEmail = email ? email.toLowerCase(): null;
        const lowerUsername= username ? username.toLowerCase(): null;

        const user = await Usuario.findOne({
            $or: [{username: lowerUsername },{email: lowerEmail}]
        });
        if(!user){
            return res.status(400).json({
                msg: 'Credenciales incorrectas, el correo no esta registrado'
            });
        }   

        if(!user.status){
            return  res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            });
        }

        const validPassword= await verify(user.password,password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'La contrasena es incorrecta'
            });
        }

        const token = await generarJWT(user.id);

        res.status(200).json({
            msg: 'Login OK',
            userDetails:{
                username: user.username,
                token: token,
                profilePicture: user.profilePicture
            }
        })


    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: "Comuniquese con el administrador",
            error: e.message
        })
    }
}

export const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { password, email, oldPassword, username, ...data } = req.body;

    try {
        // Validar y transformar el email y el username si se proporcionan
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        // Buscar el usuario por email o username
        const user = await Usuario.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });


        if (!user) {
            return res.status(404).json({
                msg: 'No se encontró al usuario'
            });
        }


        // Verificar la contraseña anterior
        const validPassword = await verify(user.password, oldPassword);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            });
        }

        // Validar que se proporcione una nueva contraseña
        if (!password) {
            return res.status(400).json({
                msg: 'La nueva contraseña es requerida.'
            });
        }
        // Hacer el hash de la nueva contraseña
        const hashPassword = await hash(password);

        // Actualizar el usuario con la nueva contraseña
        const updatedUser = await Usuario.findByIdAndUpdate(id, {
            ...data,
            password: hashPassword
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                msg: 'No se encontró al usuario'
            });
        }

        // Devolver la respuesta exitosa
        return res.status(200).json({
            success: true,
            msg: 'Contraseña actualizada correctamente',
            updatedUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar la contraseña',
            error: error.message
        });
    }
}