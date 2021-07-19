USE Yad2

--ApartmentTypes, ApartmentConditions, ApartmentProperties, ApartmentPublishers

CREATE TABLE ApartmentTypes
(
	ApartmentTypeID INT IDENTITY(1,1) NOT NULL Primary Key,
	Type nvarchar(50) NOT NULL
)

INSERT INTO ApartmentTypes (Type)
VALUES
	('apartment'),
    ('garden-apartment'),
    ('private-house/cottage'),
    ('rooftop/penthouse'),
    ('lots'),
    ('duplex'),
    ('vacation-apartment'),
    ('two-family-dwelling'),
    ('basement/parterre'),
    ('triplex'),
    ('residential-unit'),
    ('farm/estate'),
    ('auxiliary-farm'),
    ('protected-accommodation'),
    ('residential-building'),
    ('studio/loft'),
    ('garage'),
    ('parking'),
    ('general')


CREATE TABLE ApartmentConditions
(
	ApartmentConditionID INT IDENTITY(1,1) NOT NULL Primary Key,
	Condition nvarchar(50) NOT NULL
)

INSERT INTO ApartmentConditions (Condition)
VALUES
	('brand-new'),
    ('new'),
    ('renovated'),
    ('good'),
    ('in-need-of-renovation')

CREATE TABLE ApartmentProperties
(
	ApartmentPropertyID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	PropertyName nvarchar(50) NOT NULL
)

INSERT INTO ApartmentProperties (PropertyName)
VALUES
	('IsStandingOnPolls'),
	('HasAirConditioning'),
	('HasFurniture'),
	('IsRenovated'),
	('HasSafeRoom'),
	('IsAccessible'),
	('HasKosherKitchen'),
	('HasShed'),
	('HasLift'),
	('HasSunHeatedWaterTanks'),
	('HasPandorDoors'),
	('HasTadiranAc'),
	('HasWindowBars')


CREATE TABLE ApartmentPublishers
(
	ApartmentPublisherID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	PublisherName nvarchar(50),
	PhoneNumber nvarchar(10) NOT NULL CHECK (LEFT(PhoneNumber, 1) = '0')
)


CREATE TABLE Apartments
(
	ApartmentID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	TypeID INT NOT NULL FOREIGN KEY REFERENCES ApartmentTypes(ApartmentTypeID),
	ConditionID INT NOT NULL FOREIGN KEY REFERENCES ApartmentConditions(ApartmentConditionID),

	Town nvarchar(50) NOT NULL,
	Street nvarchar(50),
	HouseNum INT NOT NULL CHECK (HouseNum >= 0),
	FloorNum INT NOT NULL CHECK (FloorNum >= 0),
	BuildingMaxFloor INT NOT NULL CHECK (BuildingMaxFloor >= 0),

	NumberOfRooms FLOAT NOT NULL CHECK (0 < NumberOfRooms AND NumberOfRooms < 12 AND (NumberOfRooms % 1 = 0 OR (NumberOfRooms % 1 = 0.5 AND (NumberOfRooms < 7 OR NumberOfRooms > 1)))),
	NumberOfParkingSpots INT NOT NULL DEFAULT 0 CHECK (0 <= NumberOfParkingSpots AND NumberOfParkingSpots <= 3),
	NumberOfBalconies INT NOT NULL DEFAULT 0 CHECK (0 <= NumberOfParkingSpots AND NumberOfParkingSpots <= 3),
	ApartmentDescription nvarchar(400),
	FurnitureDescription nvarchar(400),

	Price FLOAT NOT NULL CHECK (Price > 100000),
	BuiltSqm FLOAT CHECK (BuiltSqm > 0),
	TotalSqm FLOAT NOT NULL CHECK (TotalSqm > 0),
	EntranceDate DATETIME2 NOT NULL DEFAULT CONVERT (date, SYSDATETIME()) CHECK (EntranceDate >= CONVERT (date, SYSDATETIME())),
	IsEntranceImmediate BIT NOT NULL DEFAULT 0,
	Email nvarchar(50),
	PublisherUserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID)
)

-- Connections tables - properties and publishers

CREATE TABLE ApartmentsToPropertiesConnections
(
	ApartmentID INT NOT NULL FOREIGN KEY REFERENCES Apartments(ApartmentID),
	ApartmentPropertyID INT NOT NULL FOREIGN KEY REFERENCES ApartmentProperties(ApartmentPropertyID)
)

CREATE TABLE ApartmentsToPublishersConnections
(
	ApartmentID INT NOT NULL FOREIGN KEY REFERENCES Apartments(ApartmentID),
	ApartmentPublisherID INT NOT NULL FOREIGN KEY REFERENCES ApartmentPublishers(ApartmentPublisherID)
)
