import { Router } from "express";
import { check } from "express-validator";
import { savePost, updatePost, getPost,searchPost,deletPost,getPostByCourse, addComment, editComment, deleteComment } from "./post.controller.js";
import {validarCampos} from '../middleware/validar-campos.js'

const rt = Router();

rt.post(
    "/",
    [
        validarCampos
    ],
    savePost
)

rt.put(
    "/:id",
    [
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    updatePost
)

rt.get("/", getPost)

rt.get(
    "/:id",
    [
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    searchPost
)

rt.get(
    "/:catId",
    [
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    getPostByCourse
)

rt.delete(
    "/:id",
    [
        check("id","No es un id válido").isMongoId(),
        validarCampos
    ],
    deletPost
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