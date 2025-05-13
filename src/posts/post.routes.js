import { Router } from "express";
import { check } from "express-validator";
import { saveOp, updateOp, getOp,searchOp,deletOp, addComment, editComment, deleteComment } from "./post.controller.js";
import {validarCampos} from '../middleware/validar-campos.js'

const rt = Router();

rt.post(
    "/",
    [
        validarCampos
    ],
    saveOp
)

rt.put(
    "/:id",
    [
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    updateOp
)

rt.get("/", getOp)

rt.get(
    "/:id",
    [
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    searchOp
)

rt.delete(
    "/:id",
    [
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    deletOp
)

//---------------- Comments--------------------------
rt.post(
    '/:id/',
    [
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    addComment
)

rt.put(
    '/:id/:commentId' ,
    [
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    editComment
)

rt.delete(
    '/:id/:commentId' ,
    [ 
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    deleteComment
)

export default rt;