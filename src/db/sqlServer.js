const sql = require("mssql");

// Config for your database
const config = {
  server: "localhost",
  port: 1433,
  user: "shakedshav",
  password: "s323846535",
  options: {
    database: "Sample1",
    encrypt: false,
  },
};

// Connect to your database
sql.connect(config, (err) => {
  if (err) {
    console.log(err);
  }

  // Create Request object
  const request = new sql.Request();
  request.query(
    "USE Sample1 SELECT * FROM tblGender",
    function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      console.log(recordset);
    }
  );

  // Query to the database and get the records
  // request.query()
});
