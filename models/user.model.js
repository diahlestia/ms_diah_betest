import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true,
        minlength: [6, "Account number should be of at least 6 characters."],
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    identityNumber: {
        type: String,
        required: true,
        unique: true,
        minlength: [8, "Identity number should be of at least 8 characters."],
    },
    password: { 
        type: String, 
        required: true,
        minlength: [6, "Password number should be of at least 6 characters."],
    }

}, { timestamps: true }); 

// encrypt password before save
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')){
        return next();
    } 
    this.password = await bcrypt.hash(this.password,10)
})

// validate the password with passed on user password
userSchema.methods.isValidatedPassword= async function(usersendPassword, password) {
    return await bcrypt.compare(usersendPassword,password);
}

// create and return jwt token
userSchema.methods.getJwtToken = function() {
    console.log('jwt token', process.env.JWT_EXPIRE);
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: +(process.env.JWT_EXPIRE)
    })
}

userSchema.index({ emailAddress: 1 });
userSchema.index({ userName: 1 });
userSchema.index({ accountNumber: 1 });
userSchema.index({ identityNumber: 1 });


const User = mongoose.model('User', userSchema);

export default User;