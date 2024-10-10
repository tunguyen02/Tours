import UserModel from "../model/userModel.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import { passwordChangedAfter } from "../utils/passwordUtils.js";

const authMiddleware = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await UserModel.findById(decoded.id);
        //co the tk da bi xoa
        if (!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist.', 401));
        }
        //neu doi pass sau khi tao token
        if (passwordChangedAfter(decoded.iat, currentUser.passwordChangedAt)) {
            return next(new AppError('User recently changed password! Please log in again.', 401));
        }
        req.user = currentUser;
        next();
    } catch (error) {
        return next(new AppError('Invalid token! Please log in again.', 401));
    }
}

export default authMiddleware;
