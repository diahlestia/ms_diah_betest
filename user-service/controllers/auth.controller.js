import { 
    saveUserData,
    getUserByEmailOrUsername,
} from '../services/user.service.js'
import { sendUserEvent } from '../utils/kafka.producer.js';
import { validatePassword, generateJwtToken } from '../utils/user.helper.js'; // Adjust the path as necessary

export const createUser = async (req, res) => {    
    try {
    const { username, email, password, identityNumber, accountNumber } = req.body;

    const existingUser = await getUserByEmailOrUsername(email)
        
    if (existingUser) {
        return res.status(400).json({ success: false, message: "User Already Exists!" });
    }

    const user = {
        userName: username,
        emailAddress: email,
        password,
        identityNumber,
        accountNumber,
    }

    const userRegist = await saveUserData(user);

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

        const user = await getUserByEmailOrUsername(email, username);

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "User Not Found",
                data: null
            });
        }
        
        await sendUserEvent('USER_LOGIN', user.id);

        const isValidatedPassword = await validatePassword(password, user.password);

        if (!isValidatedPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid credentials",
                data: null
            });
        }
        
        const token = generateJwtToken(user._id);

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