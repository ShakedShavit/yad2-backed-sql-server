const isUserAuthQuery = (userId, token) => {
  return `
        DECLARE @isUserAuth AS BIT
        EXEC sp_is_user_auth ${userId}, '${token}', @isUserAuth OUTPUT
        SELECT isUserAuth = @isUserAuth
    `;
};

module.exports = { isUserAuthQuery };
