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

const insertApartmentProc = () => {
  return `
        CREATE OR ALTER PROCEDURE dbo.sp_insert_apartment
        @TypeID INT,
        @ConditionID INT,
        @Town NVARCHAR(50),
        @Street NVARCHAR(50),
        @HouseNum INT,
        @FloorNum INT,
        @BuildingMaxFloor INT,
        @NumberOfRooms FLOAT,
        @NumberOfParkingSpots INT,
        @NumberOfBalconies INT,
        @ApartmentDescription NVARCHAR(400),
        @FurnitureDescription NVARCHAR(400),
        @Price FLOAT,
        @BuiltSqm FLOAT,
        @TotalSqm FLOAT,
        @EntranceDate DATETIME2,
        @IsEntranceImmediate BIT,
        @Email NVARCHAR(50),
        @PublisherUserID INT
        AS
            INSERT INTO Apartments
            (
                TypeID,
                ConditionID,
                Town,
                Street,
                HouseNum,
                FloorNum,
                BuildingMaxFloor,
                NumberOfRooms,
                NumberOfParkingSpots,
                NumberOfBalconies,
                ApartmentDescription,
                FurnitureDescription,
                Price,
                BuiltSqm,
                TotalSqm,
                EntranceDate,
                IsEntranceImmediate,
                Email,
                PublisherUserID
            )
            OUTPUT INSERTED.ApartmentID
            VALUES
                (
                @TypeID,
                @ConditionID,
                @Town,
                @Street,
                @HouseNum,
                @FloorNum,
                @BuildingMaxFloor,
                @NumberOfRooms,
                @NumberOfParkingSpots,
                @NumberOfBalconies,
                @ApartmentDescription,
                @FurnitureDescription,
                @Price,
                @BuiltSqm,
                @TotalSqm,
                @EntranceDate,
                @IsEntranceImmediate,
                @Email,
                @PublisherUserID
                )
        RETURN;
    `;
};

const insertApartmentPropertiesConnectionProc = () => {
  return `
        CREATE OR ALTER PROCEDURE dbo.sp_insert_property_connection
        @ApartmentPropertyID INT,
        @ApartmentID INT
        AS
            INSERT INTO ApartmentsToPropertiesConnections (ApartmentPropertyID, ApartmentID)
            VALUES
                (
                    @ApartmentPropertyID,
                    @ApartmentID
                )
        RETURN;
    `;
};

const insertPublisherProc = () => {
  return `
        CREATE OR ALTER PROCEDURE dbo.sp_insert_publisher
        @PublisherName NVARCHAR(50),
        @PhoneNumber NVARCHAR(10)
        AS
            INSERT INTO ApartmentPublishers (PublisherName, PhoneNumber)
            OUTPUT INSERTED.ApartmentPublisherID
            VALUES
                (
                    @PublisherName,
                    @PhoneNumber
                )
        RETURN;
    `;
};

const insertApartmentPublishersConnectionProc = () => {
  return `
        CREATE OR ALTER PROCEDURE dbo.sp_insert_publisher_connection
        @ApartmentID INT,
        @ApartmentPublisherID INT
        AS
            INSERT INTO ApartmentsToPublishersConnections (ApartmentID, ApartmentPublisherID)
            VALUES
                (
                    @ApartmentID,
                    @ApartmentPublisherID
                )
        RETURN;
    `;
};

const insertApartmentFilesConnectionProc = () => {
  return `
        CREATE OR ALTER PROCEDURE dbo.sp_insert_file_connection
        @ApartmentID INT,
        @FileKey NVARCHAR(1024)
        AS
            INSERT INTO ApartmentsToFilesConnections (ApartmentID, FileKey)
            VALUES
                (
                    @ApartmentID,
                    @FileKey
                )
        RETURN;
    `;
};

module.exports = {
  insertUserProc,
  insertTokenProc,
  insertApartmentProc,
  insertApartmentPropertiesConnectionProc,
  insertPublisherProc,
  insertApartmentPublishersConnectionProc,
  insertApartmentFilesConnectionProc,
};
