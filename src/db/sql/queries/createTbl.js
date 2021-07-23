// Users

const createNewTable = (tblName, tableStr) => {
  return `
        CREATE TABLE ${tblName}
        (
            ${tableStr},
            CreatedAt DATETIME2 DEFAULT CONVERT (date, SYSDATETIME())
        )
    `;
};

const createUsersTbl = () => {
  const tableColumns = `
        UserID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Email nvarchar(50) NOT NULL UNIQUE,
        UserPassword nvarchar(100) NOT NULL CHECK (LEN(UserPassword) >= 6),
        FirstName nvarchar(50) NOT NULL CHECK (LEN(FirstName) >= 1),
        LastName nvarchar(50) NOT NULL CHECK (LEN(LastName) >= 1),
        PhoneNumber nvarchar(10) NOT NULL CHECK (LEN(PhoneNumber) = 10 AND LEFT(PhoneNumber, 1) = '0'),
        DateOfBirth DATETIME2 CHECK (DateOfBirth < CONVERT (date, SYSDATETIME()))`;
  return createNewTable("Users", tableColumns);
};

const createTokensToUsersTbl = () => {
  const tableColumns = `
        Token nvarchar(400) NOT NULL UNIQUE,
        UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE`;
  return createNewTable("TokensToUsersConnections", tableColumns);
};

// Apartments

const createApartmentTypesTbl = () => {
  const tableColumns = `
  ApartmentTypeID INT IDENTITY(1,1) NOT NULL Primary Key,
  Type nvarchar(50) NOT NULL UNIQUE`;
  return createNewTable("ApartmentTypes", tableColumns);
};

const createApartmentConditionsTbl = () => {
  const tableColumns = `
  ApartmentConditionID INT IDENTITY(1,1) NOT NULL Primary Key,
  Condition nvarchar(50) NOT NULL UNIQUE`;
  return createNewTable("ApartmentConditions", tableColumns);
};

const createApartmentPropertiesTbl = () => {
  const tableColumns = `
  ApartmentPropertyID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  PropertyName nvarchar(50) NOT NULL UNIQUE`;
  return createNewTable("ApartmentProperties", tableColumns);
};

const createApartmentPublishersTbl = () => {
  const tableColumns = `
  ApartmentPublisherID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  PublisherName nvarchar(50),
  PhoneNumber nvarchar(10) NOT NULL CHECK (LEN(PhoneNumber) = 10 AND LEFT(PhoneNumber, 1) = '0')`;
  return createNewTable("ApartmentPublishers", tableColumns);
};

const createApartmentsTbl = () => {
  const tableColumns = `
  ApartmentID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  TypeID INT NOT NULL FOREIGN KEY REFERENCES ApartmentTypes(ApartmentTypeID),
  ConditionID INT NOT NULL FOREIGN KEY REFERENCES ApartmentConditions(ApartmentConditionID),

  Town nvarchar(50) NOT NULL,
  Street nvarchar(50),
  HouseNum INT NOT NULL CHECK (HouseNum >= 0),
  FloorNum INT NOT NULL CHECK (FloorNum >= 0),
  BuildingMaxFloor INT NOT NULL CHECK (BuildingMaxFloor >= 0),

  NumberOfRooms FLOAT NOT NULL CHECK (0 < CONVERT(DECIMAL, NumberOfRooms) AND CONVERT(DECIMAL, NumberOfRooms) < 12 AND (CONVERT(DECIMAL, NumberOfRooms) % 1 = 0 OR (CONVERT(DECIMAL, NumberOfRooms) % 1 = 0.5 AND (CONVERT(DECIMAL, NumberOfRooms) < 7 OR CONVERT(DECIMAL, NumberOfRooms) > 1)))),
  NumberOfParkingSpots INT NOT NULL DEFAULT 0 CHECK (0 <= NumberOfParkingSpots AND NumberOfParkingSpots <= 3),
  NumberOfBalconies INT NOT NULL DEFAULT 0 CHECK (0 <= NumberOfBalconies AND NumberOfBalconies <= 3),
  ApartmentDescription nvarchar(400),
  FurnitureDescription nvarchar(400),

  Price FLOAT NOT NULL CHECK (Price >= 100000),
  BuiltSqm FLOAT CHECK (BuiltSqm > 0),
  TotalSqm FLOAT NOT NULL CHECK (TotalSqm > 0),
  EntranceDate DATETIME2 NOT NULL DEFAULT CONVERT (date, SYSDATETIME()) CHECK (EntranceDate >= CONVERT (date, SYSDATETIME())),
  IsEntranceImmediate BIT NOT NULL DEFAULT 0,
  Email nvarchar(50),
  PublisherUserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE`;
  return createNewTable("Apartments", tableColumns);
};

const createApartmentsToTypesTbl = () => {
  const tableColumns = `
  ApartmentID INT NOT NULL FOREIGN KEY REFERENCES Apartments(ApartmentID),
  ApartmentTypeID INT NOT NULL FOREIGN KEY REFERENCES ApartmentTypes(ApartmentTypeID)`;
  return createNewTable("ApartmentsToTypesConnections", tableColumns);
};

const createApartmentsToPropertiesTbl = () => {
  const tableColumns = `
  ApartmentID INT NOT NULL FOREIGN KEY REFERENCES Apartments(ApartmentID),
  ApartmentPropertyID INT NOT NULL FOREIGN KEY REFERENCES ApartmentProperties(ApartmentPropertyID)`;
  return createNewTable("ApartmentsToPropertiesConnections", tableColumns);
};

const createApartmentsToPublishersTbl = () => {
  const tableColumns = `
  ApartmentID INT NOT NULL FOREIGN KEY REFERENCES Apartments(ApartmentID),
  ApartmentPublisherID INT NOT NULL FOREIGN KEY REFERENCES ApartmentPublishers(ApartmentPublisherID)`;
  return createNewTable("ApartmentsToPublishersConnections", tableColumns);
};

const createApartmentsToFilesTbl = () => {
  const tableColumns = `
  ApartmentID INT NOT NULL FOREIGN KEY REFERENCES Apartments(ApartmentID),
  FileKey nvarchar(1024) NOT NULL`;
  return createNewTable("ApartmentsToFilesConnections", tableColumns);
};

module.exports = {
  createUsersTbl,
  createTokensToUsersTbl,
  createApartmentTypesTbl,
  createApartmentConditionsTbl,
  createApartmentPropertiesTbl,
  createApartmentPublishersTbl,
  createApartmentsTbl,
  createApartmentsToTypesTbl,
  createApartmentsToPropertiesTbl,
  createApartmentsToPublishersTbl,
  createApartmentsToFilesTbl,
};
