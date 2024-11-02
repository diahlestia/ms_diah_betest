import mongoose from "mongoose";
import getRedis from '../config/redis.js';
import { sendUserEvent } from '../utils/kafka.producer.js';
import { 
    getUser,
    getUserById,
    getUserByAccountNumber,  
    getUserByIdentityNumber,
    updateUserData,
    deleteUserData
} from '../services/user.service.js'


export const findUserByAccountNumber = async (req, res, next) =>{

    const { accountNumber } = req.params;

    try {
        const user = await getUserByAccountNumber(accountNumber)

        await sendUserEvent('USER_READ', req.user.id);

        if (!user){
            return res.status(400).json({
                success: true,
                message: "User Not Found",
            })
        }

        return res.status(201).json({
            success: true,
            message: "Get User by Account Number Successfully",
            data: user
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

export const findUserByIdentityNumber = async (req, res, next) =>{

    const { identityNumber } = req.params;

    try {
        const user = await getUserByIdentityNumber(identityNumber)

        await sendUserEvent('USER_READ', req.user.id);

        if (!user){
            return res.status(400).json({
                success: true,
                message: "User Not Found",
            })
        }

        return res.status(201).json({
            success: true,
            message: "Get User by Identity Number Successfully",
            data: user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

export const getAllUsers = async (req, res, next) =>{

    try {

        const redis = getRedis();

        const cachedUser = await redis.get('users:list');

        await sendUserEvent('USER_READ', req.user.id);
        
        if (cachedUser) {
            return res.status(200).json({
                success: true,
                message: "Get All User Successfully",
                data: JSON.parse(cachedUser)
            });
        }

        const users = await getUser()

        await redis.setEx('users:list', 3600, JSON.stringify(users));

        return res.status(201).json({
            success: true,
            message: "Get All User Successfully",
            data: users
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "User ID not found" });
    }
  
    try {
        const findUser = await getUserById(id)
        
        if (!findUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const updatedUser = await updateUserData(id, user);

        await sendUserEvent('USER_UPDATED', req.user.id);
    
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
    
        return res.status(201).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
      console.error("Error when updating user:", error.message);

      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }
  
      return res.status(500).json({ success: false, message: "Server Error" });
    }
};  

export const deleteUser = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "User ID not found" });
    }
  
    try {
        const findUser = await getUserById(id)
        
        if (!findUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const deletedUser = await deleteUserData(id);
        await sendUserEvent('USER_DELETED', req.user.id);
  
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
    
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: null
        });
    } catch (error) {
        console.error("Error when deleting user:", error.message);
    
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
  