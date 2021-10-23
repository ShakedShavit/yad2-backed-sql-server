const { default: validator } = require("validator");

const validateNewUser = async (req, res, next) => {
    const sendErr = (errMsg) => res.status(400).send(errMsg);

    const { email, password, firstName, lastName, phoneNumber } = req.body;

    if (!email) return sendErr("Email is required");
    if (!password) return sendErr("Password is required");
    if (!firstName) return sendErr("First name is required");
    if (!lastName) return sendErr("Last name is required");
    if (!phoneNumber) return sendErr("Phone number is required");

    if (!validator.isEmail(email)) return sendErr("Email is not valid");
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(password))
        return sendErr(
            "Passwords must contain at least six characters, at least one letter, one number and one capital letter"
        );
    if (!/^[a-zA-Zא-ת]+$/.test(firstName)) throw new Error("First name must only include letters");
    if (!/^[a-zA-Zא-ת]+$/.test(lastName)) throw new Error("Last name must only include letters");

    next();
};

module.exports = validateNewUser;
