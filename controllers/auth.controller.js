import User from "../models/user.model.js"
import { sendUserEvent } from '../kafka/producer.js';

export const createUser = async (req, res) => {
    //TODO: handle transaction
    
    try {
    const { username, email, password, identityNumber, accountNumber } = req.body;

    const existingUser = await User.findOne({ emailAddress: email })

    if (existingUser) {
        return res.status(400).json({ success: false, message: "User Already Exists!" });
    }

    const user = new User({
        userName: username,
        emailAddress: email,
        password,
        identityNumber,
        accountNumber,
    });

    const userRegist = await user.save();

    await sendUserEvent('USER_CREATED', userRegist.id);

    return res.status(201).json({
        success: true,
        message: "User Created Successfully",
        data: user,
    });
    } catch (error) {
    console.error(error);

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

export const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide username or email and password",
                data: null
            });
        }

        const user = await User.findOne({ $or: [{ userName: username }, { emailAddress: email }] });

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "User Not Found",
                data: null
            });
        }
        
        await sendUserEvent('USER_LOGIN', user.id);

        const isValidatedPassword = await user.isValidatedPassword(password, user.password);

        if (!isValidatedPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid credentials",
                data: null
            });
        }

        const token = user.getJwtToken();

        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            data: { token },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: "Server Error",
            data: null
        });
    }
};
