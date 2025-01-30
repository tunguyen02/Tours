import UserModel from "../model/userModel.js"
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";

const signToken = id => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        secure: false,
        httpOnly: true
    })
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

const authController = {
    signup: async (req, res) => {
        try {
            const newUser = await UserModel.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm
            });
            createSendToken(newUser, 201, res);
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });

        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Please provide email and password'
                });
            }
            const user = await UserModel.findOne({ email }).select('+password');

            if (!user || !(await user.correctPassword(password, user.password))) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'Incorrect email or password'
                });
            }
            createSendToken(user, 200, res);
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const user = await UserModel.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'There is no user with email address'
                });
            }

            const resetToken = user.createPasswordResetToken();
            await user.save({ validateBeforeSave: false });

            const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;

            const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Your password reset token (valid for 10 min)',
                    message
                });
                res.status(200).json({
                    status: 'success',
                    message: 'Token sent to email'
                });
            } catch (error) {
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                await user.save({ validateBeforeSave: false });
            }
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });

        }
    },

    resetPassword: async (req, res) => {
        try {
            const hashedToken = crypto
                .createHash('sha256')
                .update(req.params.token)
                .digest('hex');
            const user = await UserModel.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: Date.now() }
            });
            if (!user) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Token is invalid or has expired'
                });
            }
            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            createSendToken(user, 200, res);
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });

        }
    },

    updatePassword: async (req, res) => {
        try {
            const user = await UserModel.findById(req.user.id).select('+password');
            if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'Your current password is wrong'
                });
            }
            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;
            await user.save();
            createSendToken(user, 200, res);
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });
        }
    }
}

export default authController;