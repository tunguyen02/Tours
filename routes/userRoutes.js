import { Router } from "express";
import userController from "../controller/userController.js";
import authController from "../controller/authController.js";

const userRouter = Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);

userRouter.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

userRouter.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

export default userRouter;