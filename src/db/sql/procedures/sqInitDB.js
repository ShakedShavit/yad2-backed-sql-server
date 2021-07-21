// const createDbProc = () => {
//   return `
//         CREATE OR ALTER PROCEDURE create_yad2_db
//         AS
//         BEGIN
//             DECLARE @SQL_SERVER_DB_NAME nvarchar(128)
//             SET @SQL_SERVER_DB_NAME = N'${process.env.SQL_SERVER_DB_NAME}'
//             IF DB_ID('@SQL_SERVER_DB_NAME') IS NULL
//             BEGIN
//                 CREATE DATABASE ${process.env.SQL_SERVER_DB_NAME}
//             END;
//         END;
//         GO;
//     `;
// };

// const createDb = () => {
//   return `
//         IF DB_ID(N'${process.env.SQL_SERVER_DB_NAME}') IS NULL
//         BEGIN
//             CREATE DATABASE ${process.env.SQL_SERVER_DB_NAME}
//         END;
//     `;
// };

// const createCheckIfTblExistsProc = () => {
//   return `
//         CREATE OR ALTER PROCEDURE dbo.sp_does_tbl_exist
//         @tblName nvarchar(128),
//         @doesExistBool bit OUTPUT
//         AS
//         BEGIN
//             IF OBJECT_ID('dbo.@tblName') IS NULL
//                 SELECT @doesExistBool = 0
//             ELSE
//                 SELECT @doesExistBool = 1
//         END;
//         RETURN;
//     `;
// };

// const createNewTable = (tblName, tableStr) => {
//     return `
//         CREATE PROC dbo.sp_create_users_tbl
//         AS
//         BEGIN
//             DECLARE @doesExistBool bit
//             EXEC sp_does_tbl_exist @doesExistBool OUTPUT

//             IF (@doesExistBool = 0)
//             BEGIN
//                 CREATE TABLE ${tblName}
//                 (
//                     ${tableStr}
//                 )
//             END;
//         END;
//     `;
// }

// const createUsersTblProc = () => {
//   return `
//         CREATE PROC dbo.sp_create_users_tbl
//         AS
//         BEGIN
//             DECLARE @doesExistBool bit
//             EXEC sp_does_tbl_exist @doesExistBool OUTPUT

//             IF (@doesExistBool = 0)
//             BEGIN
//                 CREATE TABLE Users
//                 (
//                     UserID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
//                     Email nvarchar(50) NOT NULL UNIQUE,
//                     UserPassword nvarchar(50) NOT NULL CHECK (LEN(UserPassword) >= 6),
//                     FirstName nvarchar(50) NOT NULL CHECK (LEN(FirstName) >= 1),
//                     LastName nvarchar(50) NOT NULL CHECK (LEN(LastName) >= 1),
//                     PhoneNumber nvarchar(10) NOT NULL CHECK (LEN(PhoneNumber) = 10 AND LEFT(PhoneNumber, 1) = '0'),
//                     DateOfBirth DATETIME2 CHECK (DateOfBirth < CONVERT (date, SYSDATETIME()))
//                 )
//             END;
//         END;
//     `;
// };

// const createTokensToUsersTblProc = () => {
//   return `
//         CREATE PROC dbo.sp_create_tokens_to_users_tbl
//         AS
//         BEGIN
//             DECLARE @doesExistBool bit
//             EXEC sp_does_tbl_exist @doesExistBool OUTPUT

//             IF (@doesExistBool = 0)
//             BEGIN
//                 CREATE TABLE TokensToUsersConnections
//                 (
//                     Token nvarchar(400) NOT NULL,
//                     UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE
//                 )
//             END;
//         END;
//     `;
// };

// module.exports = {
//   createCheckIfTblExistsProc,
// };
