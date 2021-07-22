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

module.exports = {
  getUserByEmailQuery,
  getUserByIdQuery,
  getApartmentTypeIdQuery,
  getApartmentConditionIdQuery,
  getAllApartmentProperties,
};
