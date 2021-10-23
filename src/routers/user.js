const express = require("express");
const auth = require("../middleware/auth");
const { getStrValFromRedis, setStrInRedis } = require("../utils/redis");
const validateNewUser = require("../middleware/newUserValidation");
const { addUser } = require("../db/sql/queries/insert");
const {
    generateAuthToken,
    addTokenToDB,
    findUserByCredentials,
    getUserObjForClient,
} = require("../utils/users");
const sqlQueryPromise = require("../db/sqlServer");
const { deleteTokenQuery } = require("../db/sql/queries/delete");

const router = express.Router();

router.get("/", async (req, res) => {
    res.send("API is Working!");
});

router.post("/login", async (req, res) => {
    try {
        const user = await findUserByCredentials(req.body.email, req.body.password);
        const userId = user?.recordset[0]?.UserID;
        const token = await generateAuthToken(userId);
        await addTokenToDB(token, userId);

        res.status(200).send({
            user: getUserObjForClient(user?.recordset[0]),
            token,
        });
    } catch (err) {
        res.status(400).send(err.message || err);
    }
});

router.post("/signup", validateNewUser, async (req, res) => {
    try {
        const newUserRecordset = await sqlQueryPromise(
            addUser(
                req.body.email,
                req.body.password,
                req.body.firstName,
                req.body.lastName,
                req.body.phoneNumber,
                req.body.dateOfBirth
            )
        );
        const userId = newUserRecordset?.recordset[0]?.UserID;

        const token = generateAuthToken(userId);
        await addTokenToDB(token, userId);

        res.status(201).send({
            user: {
                id: userId,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
            },
            token,
        });
    } catch (err) {
        if (err.originalError?.info?.number === 2627)
            return res.status(400).send("Email is already taken");
        res.status(400).send(err.message);
    }
});

router.post("/logout", auth, async (req, res) => {
    try {
        await sqlQueryPromise(deleteTokenQuery(req.token));
        res.status(200).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
