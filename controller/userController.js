import UserModel from "../model/userModel.js";
import AppError from "../utils/appError.js";
import apiFeatures from "../utils/apiFeatures.js";

const userController = {
    getAllUsers: async (req, res, next) => {
        try {
            const users = await UserModel.find();
            res.status(200).json({
                status: 'success',
                results: users.length,
                data: {
                    users
                }
            });
        } catch (error) {
            next(error);
        }
    },

    createUser: (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    },

    getUser: (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    },


    updateUser: (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    },

    deleteUser: (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    }

}

export default userController;