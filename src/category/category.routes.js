import { Router } from "express";
import  {check} from "express-validator";
import { getCat,getCatById, createCat,updateCat } from "./category.controller.js";
import { validarJWT } from "../middleware/validar-jwt.js";
import { validarCampos } from "../middleware/validar-campos.js";

const rt = new Router();

rt.post(
    '/',
    [
        validarCampos,
        check("name","Must be a valid name").not().isEmpty(),
        validarJWT
    ],
    createCat
)

rt.put(
    '/:id',
    [
        validarCampos,
        check("id","Must be a valid ID").isMongoId(),
        check("name","Must be a valid name").not().isEmpty(),
        validarJWT
    ],
    updateCat
)

rt.get('/',getCat)

rt.get(
    '/:id',
    check("id","Must be a valid ID").isMongoId(),
    getCatById
)

export default rt;