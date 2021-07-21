const insertUserProc = () => {
  return `
        CREATE OR ALTER PROCEDURE dbo.sp_insert_user
        @Email nvarchar(50),
        @UserPassword NVARCHAR(100),
        @FirstName NVARCHAR(50),
        @LastName NVARCHAR(50),
        @PhoneNumber NVARCHAR(10),
        @DateOfBirth DATETIME2
        AS
            INSERT INTO Users (Email, UserPassword, FirstName, LastName, PhoneNumber, DateOfBirth)
            OUTPUT INSERTED.UserID
            VALUES
                (
                    @Email,
                    @UserPassword,
                    @FirstName,
                    @LastName,
                    @PhoneNumber,
                    @DateOfBirth
                )
        RETURN;
    `;
};

const insertTokenProc = () => {
  return `
          CREATE OR ALTER PROCEDURE dbo.sp_insert_token
          @Token NVARCHAR(400),
          @UserID INT
          AS
              INSERT INTO TokensToUsersConnections (Token, UserID)
              VALUES
                  (
                      @Token,
                      @UserID
                  )
          RETURN;
      `;
};

module.exports = { insertUserProc, insertTokenProc };
