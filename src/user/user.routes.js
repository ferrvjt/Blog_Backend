import { Router } from "express";
import { check } from "express-validator";
import { getUserById, getUsers, updateUser } from "./user.controller.js";
import { existeUsuarioById } from "../helper/db-validator.js";
import { validarCampos } from "../middleware/validar-campos.js";
import { uploadProfilePicture } from "../middleware/multer-upload.js";
import {validarJWT} from "../middleware/validar-jwt.js";

const rt = Router();

rt.get("/",getUsers);

rt.get(
    "/:id", 
    [
        check("id","No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
);

rt.put(
    '/:id',
    uploadProfilePicture.single('profilePicture'),
    [
        validarJWT,
        check("id","No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
);

export default rt;