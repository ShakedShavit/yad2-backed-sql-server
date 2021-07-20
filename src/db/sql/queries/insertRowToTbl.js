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

const addUser = (
  email,
  password,
  firstName,
  lastName,
  phoneNumber,
  dateOfBirth
) => {
  return `
    INSERT INTO Users (Email, UserPassword, FirstName, LastName, PhoneNumber, DateOfBirth)
    OUTPUT INSERTED.UserID
    VALUES
        (
            '${email}',
            '${password}',
            '${firstName}',
            '${lastName}',
            '${phoneNumber}',
            '${dateOfBirth}'
        )`;
};

const addToken = (token, userId) => {
  return `
      INSERT INTO TokensToUsersConnections
      VALUES
          (
              '${token}',
              ${userId}
          )`;
};

module.exports = {
  insertApartmentTypes,
  insertApartmentConditions,
  insertApartmentProperties,
  addUser,
  addToken,
};
