const sql = require("mssql");

// Config for your database
const config = {
  server: process.env.SQL_SERVER_SERVER_NAME,
  port: process.env.PORT,
  user: process.env.SQL_SERVER_USERNAME,
  password: process.env.SQL_SERVER_PASSWORD,
  options: {
    database: process.env.SQL_SERVER_DB_NAME,
    encrypt: false,
  },
};

// Connect to your database
sql.connect(config, (err) => {
  if (err) {
    console.log(err);
  }

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

  // Query to the database and get the records
  // request.query()
});

// Create Request object
const request = new sql.Request();
request.query("USE Sample1 SELECT * FROM tblGender", function (err, recordset) {
  if (err) console.log(err);

  // send records as a response
  console.log(recordset);
});
