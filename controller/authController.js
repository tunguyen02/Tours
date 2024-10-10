import jwt from "jsonwebtoken";
import UserModel from "../model/userModel.js";
import AppError from "../utils/appError.js";
import { comparePasswords } from "../utils/passwordUtils.js";

const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
};

const authController = {
    signup: async (req, res, next) => {
        try {
            const newUser = await UserModel.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm
            });
            const token = createToken(newUser._id);
            res.status(201).json({
                status: 'success',
                token,
                data: {
                    user: newUser
                }
            });
        } catch (error) {
            next(error);
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(new AppError('Please provide email and password!', 400));
            }
            const user = await UserModel.findOne({ email }).select('+password');
            const isMatch = await comparePasswords(password, user.password);
            if (!user || !isMatch) {
                return next(new AppError('Incorrect email or password', 401));
            }
            const token = createToken(user._id);
            res.status(200).json({
                status: 'success',
                token
            });

        } catch (error) {
            next(error);
        }
    }
}

export default authController;