import { Router } from "express";
import { check } from "express-validator";
import { saveOp, updateOp, getOp,searchOp,deletOp, addComment, editComment, deleteComment } from "./opinion.controller.js";
import {validarJWT} from '../middleware/validar-jwt.js';
import {validarCampos} from '../middleware/validar-campos.js'

const rt = Router();

rt.post(
    "/",
    [
        validarJWT,
        check('email','Este no es un correo valido').not().isEmpty(),
        validarCampos
    ],
    saveOp
)

rt.put(
    "/:id",
    [
        validarJWT,
        check("id","No es un id válido").isMongoId(),
        check('email','Este no es un correo valido').optional(),
        validarCampos
    ],
    updateOp
)

rt.get("/", getOp)

rt.get(
    "/:id",
    [
        validarJWT,
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    searchOp
)

rt.delete(
    "/:id",
    [
        validarJWT,
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    deletOp
)

//---------------- Comments--------------------------
rt.post(
    '/:id/',
    [
        validarJWT,
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    addComment
)

rt.put(
    '/:id/' ,
    [
        validarJWT,
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    editComment
)

rt.delete(
    '/:id/' ,
    [
        validarJWT,
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    deleteComment
)

export default rt;