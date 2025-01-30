import UserModel from "../model/userModel.js";

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

const userController = {
    getAllUsers: async (req, res) => {
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
            res.status(400).json({
                status: 'fail',
                message: error
            });

        }
    },

    updateMe: async (req, res) => {
        try {
            if (req.body.password || req.body.passwordConfirm) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'This route is not for password updates. Please use /updatePassword'
                });
            }

            const filteredBody = filterObj(req.body, 'name', 'email');

            const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, filteredBody, {
                new: true,
                runValidators: true
            });

            res.status(200).json({
                status: 'success',
                data: {
                    user: updatedUser
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });
        }
    },

    deleteMe: async (req, res) => {
        try {
            await UserModel.findByIdAndUpdate(req.user.id, {
                active: false
            });
            res.status(204).json({
                status: 'success',
                data: null
            })
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });
        }
    },

    createUser: (req, res) => {
        res.status(500).json({
            status: 'error',
            message: 'This route is not yet defined'
        });
    },

    getUser: (req, res) => {
        res.status(500).json({
            status: 'error',
            message: 'This route is not yet defined'
        });
    },

    updateUser: (req, res) => {
        res.status(500).json({
            status: 'error',
            message: 'This route is not yet defined'
        });
    },

    deleteUser: (req, res) => {
        res.status(500).json({
            status: 'error',
            message: 'This route is not yet defined'
        });
    }

}

export default userController;