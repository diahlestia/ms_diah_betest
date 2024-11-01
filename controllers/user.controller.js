import User from "../models/user.model.js"
import mongoose from "mongoose";

export const findUserByAccountNumber = async (req, res, next) =>{

    const { accountNumber } = req.params;

    try {
        const user = await User.findOne({ accountNumber })

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
        const user = await User.findOne({ identityNumber })

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
        const users = await User.find()

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
      const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
  
      if (!updatedUser) {
        await session.abortTransaction();
        session.endSession();
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
      const deletedUser = await User.findByIdAndDelete(id);
  
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
  