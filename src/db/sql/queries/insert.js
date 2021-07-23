const bcrypt = require("bcryptjs");

const insertApartmentTypes = () => {
  return `
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
    `;
};

const insertApartmentConditions = () => {
  return `
    INSERT INTO ApartmentConditions (Condition)
    VALUES
        ('brand-new'),
        ('new'),
        ('renovated'),
        ('good'),
        ('in-need-of-renovation')
    `;
};

const insertApartmentProperties = () => {
  return `
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
    `;
};

const optionalStr = (str) => (!!str ? `'${str}'` : `NULL`);

const addUser = async (
  email,
  password,
  firstName,
  lastName,
  phoneNumber,
  dateOfBirth
) => {
  password = await bcrypt.hash(password, 8);

  return `
    EXEC sp_insert_user
    '${email}',
    '${password}',
    '${firstName}',
    '${lastName}',
    '${phoneNumber}',
    ${optionalStr(dateOfBirth)}
  `;
};

const addToken = (token, userId) => {
  return `
    EXEC sp_insert_token
    '${token}',
    '${userId}'
  `;
};

const addApartment = ({
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
  PublisherUserID,
}) => {
  return `
    EXEC sp_insert_apartment
    '${TypeID}',
    '${ConditionID}',
    '${Town}',
    ${optionalStr(Street)},
    '${HouseNum}',
    '${FloorNum}',
    '${BuildingMaxFloor}',
    ${NumberOfRooms},
    '${NumberOfParkingSpots}',
    '${NumberOfBalconies}',
    ${optionalStr(ApartmentDescription)},
    ${optionalStr(FurnitureDescription)},
    ${Price},
    ${BuiltSqm},
    ${TotalSqm},
    '${EntranceDate}',
    '${IsEntranceImmediate}',
    ${optionalStr(Email)},
    '${PublisherUserID}'
  `;
};

const addApartmentToPropertyConnection = (conditionId, apartmentId) => {
  return `
    EXEC sp_insert_property_connection
    '${conditionId}',
    '${apartmentId}'
  `;
};

const addPublisher = (name, phoneNum) => {
  return `
    EXEC sp_insert_publisher
    ${optionalStr(name)},
    '${phoneNum}'
  `;
};

const addApartmentToPublisherConnection = (apartmentId, publisherId) => {
  return `
    EXEC sp_insert_publisher_connection
    '${apartmentId}',
    '${publisherId}'
  `;
};

const addApartmentToFileConnection = (apartmentId, fileKey) => {
  return `
    EXEC sp_insert_file_connection
    '${apartmentId}',
    '${fileKey}'
  `;
};

module.exports = {
  insertApartmentTypes,
  insertApartmentConditions,
  insertApartmentProperties,
  addUser,
  addToken,
  addApartment,
  addApartmentToPropertyConnection,
  addPublisher,
  addApartmentToPublisherConnection,
  addApartmentToFileConnection,
};
