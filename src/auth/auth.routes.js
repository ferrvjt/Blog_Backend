import { Router } from "express";
import { login,register, updatePassword } from "./auth.controller.js";
import { registerValidator,loginValidator, upPassValidator} from "../middleware/validator.js";
import { deleteFileonError } from "../middleware/delete-file-on-error.js";
import { uploadProfilePicture } from "../middleware/multer-upload.js";
import { validarJWT } from "../middleware/validar-jwt.js";

const router = new Router();

router.post(
    '/login',
    loginValidator,
    deleteFileonError,
    login
);

router.post(
    '/register',
    uploadProfilePicture.single("profilePicture"),
    registerValidator,
    deleteFileonError,
    register
)

router.put(
    '/password/:id',
    validarJWT,
    upPassValidator,
    updatePassword
)

export default router