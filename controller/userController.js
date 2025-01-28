import UserModel from "../model/userModel.js";

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