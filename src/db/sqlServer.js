const sql = require("mssql");
const { deleteTokenProc } = require("./sql/procedures/delete");
const { isUserAuthProc } = require("./sql/procedures/exists");
const { insertUserProc, insertTokenProc } = require("./sql/procedures/insert");
const {
  getUserByEmailProc,
  getUserByIdProc,
} = require("./sql/procedures/select");
const {
  createUsersTbl,
  createTokensToUsersTbl,
  createApartmentTypesTbl,
  createApartmentConditionsTbl,
  createApartmentPropertiesTbl,
  createApartmentPublishersTbl,
  createApartmentsTbl,
  createApartmentsToPropertiesTbl,
  createApartmentsToPublishersTbl,
  createApartmentsToFilesTbl,
} = require("./sql/queries/createTbl");

const {
  insertApartmentTypes,
  insertApartmentConditions,
  insertApartmentProperties,
} = require("./sql/queries/insert");

// Config for your database
const config = {
  server: process.env.SQL_SERVER_SERVER_NAME,
  port: parseInt(process.env.SQL_SERVER_PORT),
  user: process.env.SQL_SERVER_USER,
  password: process.env.SQL_SERVER_PWD,
  database: process.env.SQL_SERVER_DB_NAME,
  encrypt: false,
};

const initializeDB = async () => {
  sqlQuery(createUsersTbl());
  sqlQuery(createTokensToUsersTbl());

  // sqlQuery(createApartmentTypesTbl());
  // sqlQuery(createApartmentConditionsTbl());
  // sqlQuery(createApartmentPropertiesTbl());
  // sqlQuery(createApartmentPublishersTbl());
  // sqlQuery(createApartmentsTbl());
  // sqlQuery(createApartmentsToPropertiesTbl());
  // sqlQuery(createApartmentsToPublishersTbl());
  // sqlQuery(createApartmentsToFilesTbl());
  // sqlQuery(insertApartmentTypes());
  // sqlQuery(insertApartmentConditions());
  // sqlQuery(insertApartmentProperties());

  sqlQuery(insertUserProc());
  sqlQuery(insertTokenProc());
  sqlQuery(getUserByEmailProc());
  sqlQuery(getUserByIdProc());
  sqlQuery(isUserAuthProc());
  sqlQuery(deleteTokenProc());
};

// Connect to your database
sql.connect(config, async (err) => {
  if (err) {
    console.log(err);
  }
  await initializeDB();

  // // Create Request object
  // const request = new sql.Request();
  // request.query(
  //   "USE Sample1 SELECT * FROM tblGender",
  //   function (err, recordset) {
  //     if (err) console.log(err);

  //     // send records as a response
  //     console.log(recordset);
  //   }
  // );

  // Create Request object
  // const request = new sql.Request();

  // await request.batch(initializeDB(), function (err, recordset) {
  //   if (err) console.log(err.message);

  //   // send records as a response
  //   console.log(recordset);
  // });

  // request.batch(initializeDB(), function (err, recordset) {
  //   if (err) console.log(err.message);

  //   // send records as a response
  //   console.log(recordset);
  // });

  // request.batch(initializeDB(), function (err, recordset) {
  //   if (err) console.log(err);

  //   // send records as a response
  //   console.log(recordset);
  // });

  // Query to the database and get the records
  // request.query()
});

const sqlQuery = async (q) => {
  const request = new sql.Request();
  await request.query(q, function (err, recordset) {
    if (err) console.log(err.message);
    console.log(recordset);
  });
};
const sqlBatch = async (q) => {
  const request = new sql.Request();
  await request.query(q, function (err, recordset) {
    if (err) console.log(err.message);
    console.log(recordset);
  });
};

const sqlQueryPromise = (q) => {
  return new Promise((resolve, reject) => {
    const request = new sql.Request();
    request.query(q, function (err, recordset) {
      if (err) reject(err);
      resolve(recordset);
    });
  });
};

module.exports = sqlQueryPromise;
