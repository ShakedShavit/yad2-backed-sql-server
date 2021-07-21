const jwt = require("jsonwebtoken");
const { isUserAuthQuery } = require("../db/sql/queries/exists");
const { getUserByIdQuery } = require("../db/sql/queries/select");
const sqlQueryPromise = require("../db/sqlServer");

const auth = async (req, res, next) => {
  try {
    let token =
      req.query.token == undefined
        ? req.header("Authorization").replace("Bearer ", "")
        : req.query.token;
    const data = jwt.verify(token, process.env.TOKEN_SECRET);

    let user = await sqlQueryPromise(getUserByIdQuery(data._id));

    if (!user) throw new Error("User not found");

    user = user?.recordset[0];

    const isAuthRes = await sqlQueryPromise(isUserAuthQuery(data._id, token));
    if (!isAuthRes?.recordset[0].isUserAuth) throw new Error("");

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(403).send({
      status: 403,
      message: "Not authenticated",
    });
  }
};

module.exports = auth;
