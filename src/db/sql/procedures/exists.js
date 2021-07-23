const isUserAuthProc = () => {
  return `
    CREATE OR ALTER PROCEDURE dbo.sp_is_user_auth
    @userId INT,
    @token NVARCHAR(400),
    @isUserAuth BIT OUTPUT
    AS
    BEGIN
        IF EXISTS(SELECT * FROM TokensToUsersConnections WHERE UserID = @userId AND Token = @token)
          SELECT @isUserAuth = 1
        ELSE
          SELECT @isUserAuth = 0
    END;
  `;
};

const validateApartmentProc = () => {
  return `
    CREATE OR ALTER PROCEDURE dbo.sp_validate_apartment
    @ApartmentID INT,
    @doesApartmentExist BIT OUTPUT
    AS
    BEGIN
        IF EXISTS(SELECT * FROM Apartments WHERE ApartmentID = @ApartmentID)
          SELECT @doesApartmentExist = 1
        ELSE
          SELECT @doesApartmentExist = 0
    END;
  `;
};

module.exports = {
  isUserAuthProc,
  validateApartmentProc,
};
