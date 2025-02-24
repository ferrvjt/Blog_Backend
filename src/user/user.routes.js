import { Router } from "express";
import { check } from "express-validator";
import { getUserById, getUsers, updateUser } from "./user.controller.js";
import { existeUsuarioById } from "../helper/db-validator.js";
import { validarCampos } from "../middleware/validar-campos.js";
import { uploadProfilePicture } from "../middleware/multer-upload.js";
import {validarJWT} from "../middleware/validar-jwt.js";

const router = Router();

router.get("/",getUsers);

router.get(
    "/:id", 
    [
        check("id","No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
);

router.put(
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

export default router;