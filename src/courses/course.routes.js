import { Router } from "express";
import  {check} from "express-validator";
import { getCourse,getCourseByName, createCourses,updateCourse } from "./course.controller.js";
import { validarCampos } from "../middleware/validar-campos.js";

const rt = new Router();

rt.post(
    '/',
    [
        validarCampos,
        check("name","Must be a valid name").not().isEmpty()
    ],
    createCourses
)

rt.put(
    '/:id',
    [
        validarCampos,
        check("id","Must be a valid ID").isMongoId(),
        check("name","Must be a valid name").not().isEmpty()
    ],
    updateCourse
)

rt.get('/',getCourse)

rt.get(
    '/:id',
    check("id","Must be a valid ID").isMongoId(),
    getCourseByName
)

export default rt;