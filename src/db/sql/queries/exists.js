const isUserAuthQuery = (userId, token) => {
  return `
        DECLARE @isUserAuth AS BIT
        EXEC sp_is_user_auth ${userId}, '${token}', @isUserAuth OUTPUT
        SELECT isUserAuth = @isUserAuth
    `;
};

const validateApartmentQuery = (apartmentId) => {
  return `
        DECLARE @doesApartmentExist AS BIT
        EXEC sp_validate_apartment ${apartmentId}, @doesApartmentExist OUTPUT
        SELECT doesApartmentExist = @doesApartmentExist
    `;
};

module.exports = {
  isUserAuthQuery,
  validateApartmentQuery,
};
