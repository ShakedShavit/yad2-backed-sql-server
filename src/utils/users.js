const jwt = require("jsonwebtoken");
const { addToken } = require("../db/sql/queries/insertRowToTbl");
const sqlQueryPromise = require("../db/sqlServer");

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

module.exports = { generateAuthToken, addTokenToDB };
