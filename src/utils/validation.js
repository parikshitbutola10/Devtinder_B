const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstname, lastname, emailid, password } = req.body;
    if(!firstname || !lastname) {
        throw new Error("name not valid");
    } else if (!validator.isEmail(emailid)) {
        throw new Error("email not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("password not valid");
    }

};
const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstname",
        "lastname",
        "emailid",
        "age",
        "bio",
        "gender",
        "skills",
    ];

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );

    return isEditAllowed;
};

module.exports = {
     validateSignUpData,
     validateEditProfileData,
};