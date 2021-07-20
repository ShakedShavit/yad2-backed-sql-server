const createUsersTbl = () => {
  return `CREATE TABLE Users
        (
            UserID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
            Email nvarchar(50) NOT NULL UNIQUE,
            UserPassword nvarchar(50) NOT NULL CHECK (LEN(UserPassword) >= 6),
            FirstName nvarchar(50) NOT NULL CHECK (LEN(FirstName) >= 1),
            LastName nvarchar(50) NOT NULL CHECK (LEN(LastName) >= 1),
            PhoneNumber nvarchar(10) NOT NULL CHECK (LEN(PhoneNumber) = 10 AND LEFT(PhoneNumber, 1) = '0'),
            DateOfBirth DATETIME2 CHECK (DateOfBirth < CONVERT (date, SYSDATETIME()))
        )`;
};
