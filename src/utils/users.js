const jwt = require("jsonwebtoken");
const { addToken } = require("../db/sql/queries/insert");
const { getUserByEmailQuery } = require("../db/sql/queries/select");
const sqlQueryPromise = require("../db/sqlServer");
const bcrypt = require("bcryptjs");

const generateAuthToken = (userId) => {
    return jwt.sign(
        {
            _id: userId,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "6h",
        }
    );
};

const addTokenToDB = async (token, userId) => {
    await sqlQueryPromise(addToken(token, userId));
};

const findUserByCredentials = async (email, password) => {
    let loginCredentialsErrorMsg = "email and/or password are incorrect";

    let user = await sqlQueryPromise(getUserByEmailQuery(email));

    if (!user) throw new Error(loginCredentialsErrorMsg);

    const isMatch = await bcrypt.compare(password, user?.recordset[0]?.UserPassword || "");

    if (!isMatch) throw new Error(loginCredentialsErrorMsg);

    return user;
};

const getUserObjForClient = (user) => {
    return {
        id: user?.UserID,
        email: user?.Email,
        firstName: user?.FirstName,
        lastName: user?.LastName,
        phoneNumber: user?.PhoneNumber,
    };
};

module.exports = {
    generateAuthToken,
    addTokenToDB,
    findUserByCredentials,
    getUserObjForClient,
};
