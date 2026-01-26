const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 20,
    },
    lastname: {
        type: String,
    },
    emailid: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(
                    "Invalid email address: " + value);
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error(
                    "Enter a strong password: " + value);
            }
        },
    },
    age: {
        type:Number,
        min: 18,

    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is not supported`,
    },
},
isPremium: {
    type: Boolean,
    default: false,
},
membershipType: {
    type: String,
},
photoUrl: {
    type: String,
    validate(value) {
        if (!validator.isURL(value)) {
            throw new Error("Invalid URL: " + value);
        }
 },
},
about: {
    type: String,
    default: "this is a default about!",
},
skills: {
    type: [String],
},
},
    {
        timestamps: true,
    },
);

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id}, "abc", {
        expiresIn: "7d",
    });
    
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );

    return isPasswordValid;
};

module.exports = mongoose.model("User",userSchema);