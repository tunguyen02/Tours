import { Router } from "express";
import userController from "../controller/userController.js";
import authController from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.use(authMiddleware.protect);

userRouter.patch('/updateMyPassword', authController.updatePassword);
userRouter.get('/me', userController.getMe, userController.getUser);
userRouter.patch('/updateMe', userController.updateMe);
userRouter.delete('/deleteMe', userController.deleteMe);


userRouter.route('/')
    .get(authMiddleware.restrictTo('admin'), userController.getAllUsers)

userRouter.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(authMiddleware.restrictTo('admin'), userController.deleteUser);

export default userRouter;