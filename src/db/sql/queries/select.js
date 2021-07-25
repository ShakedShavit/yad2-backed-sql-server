const formatDateForSql = require("../../../utils/formatDateForSql");
const { optionalStr } = require("../utils");

getUserByEmailQuery = (email) => {
  return `
      EXEC sp_get_user
      '${email}'
  `;
};

getUserByIdQuery = (id) => {
  return `
      EXEC sp_get_user_by_id
      '${id}'
  `;
};

getApartmentTypeIdQuery = (type) => {
  return `
      EXEC sp_get_apartment_type
      '${type}'
  `;
};

getApartmentConditionIdQuery = (condition) => {
  return `
      EXEC sp_get_apartment_condition
      '${condition}'
  `;
};

const getAllApartmentProperties = () => {
  return `
    SELECT * FROM ApartmentProperties
  `;
};

const getApartments = (
  Town = null,
  Street = null,
  IsEntranceImmediate = null,
  ApartmentDescription = null,
  FurnitureDescription = null,
  MinHouseNum = null,
  MaxHouseNum = null,
  MinFloorNum = null,
  MaxFloorNum = null,
  MinBuildingMaxFloor = null,
  MaxBuildingMaxFloor = null,
  MinBuiltSqm = null,
  MaxBuiltSqm = null,
  MinTotalSqm = null,
  MaxTotalSqm = null,
  MinPrice = null,
  MaxPrice = null,
  MinEntranceDate = null,
  MaxEntranceDate = null
) => {
  switch (IsEntranceImmediate) {
    case "true":
      IsEntranceImmediate = 1;
      break;
    case "false":
      IsEntranceImmediate = 0;
      break;
    default:
      IsEntranceImmediate = "NULL";
  }

  if (MinEntranceDate) MinEntranceDate = formatDateForSql(MinEntranceDate);
  if (MaxEntranceDate) MaxEntranceDate = formatDateForSql(MaxEntranceDate);

  return `
    EXEC sp_get_apartments
    ${optionalStr(Town)},
    ${optionalStr(Street)},
    ${IsEntranceImmediate},
    ${optionalStr(ApartmentDescription)},
    ${optionalStr(FurnitureDescription)},
    ${optionalStr(MinHouseNum)},
    ${optionalStr(MaxHouseNum)},
    ${optionalStr(MinFloorNum)},
    ${optionalStr(MaxFloorNum)},
    ${optionalStr(MinBuildingMaxFloor)},
    ${optionalStr(MaxBuildingMaxFloor)},
    ${optionalStr(MinBuiltSqm)},
    ${optionalStr(MaxBuiltSqm)},
    ${optionalStr(MinTotalSqm)},
    ${optionalStr(MaxTotalSqm)},
    ${optionalStr(MinPrice)},
    ${optionalStr(MaxPrice)},
    ${optionalStr(MinEntranceDate)},
    ${optionalStr(MaxEntranceDate)}
  `;
};

module.exports = {
  getUserByEmailQuery,
  getUserByIdQuery,
  getApartmentTypeIdQuery,
  getApartmentConditionIdQuery,
  getAllApartmentProperties,
  getApartments,
};
