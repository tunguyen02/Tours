import { Router } from "express";
import userController from "../controller/userController.js";
import authController from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);
userRouter.patch('/updateMyPassword', authMiddleware.protect, authController.updatePassword);

userRouter.patch('/updateMe', authMiddleware.protect, userController.updateMe);
userRouter.delete('/deleteMe', authMiddleware.protect, userController.deleteMe);


userRouter.route('/')
    .get(userController.getAllUsers)

userRouter.route('/:id')
    .get(userController.getUser)
    .patch(
        authMiddleware.protect,
        userController.updateUser
    )
    .delete(
        authMiddleware.protect,
        authMiddleware.restrictTo('admin'),
        userController.deleteUser
    );

export default userRouter;