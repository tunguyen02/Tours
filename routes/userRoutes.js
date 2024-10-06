import { Router } from "express";
import userController from "../controller/userController.js";

const userRouter = Router();

userRouter.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

userRouter.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

export default userRouter;