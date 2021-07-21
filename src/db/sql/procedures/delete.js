const deleteTokenProc = () => {
  return `
      CREATE OR ALTER PROCEDURE dbo.sp_delete_token
      @token NVARCHAR(400)
      AS
      BEGIN
        DELETE FROM TokensToUsersConnections
        WHERE Token = @token
      END;
      `;
};

module.exports = {
  deleteTokenProc,
};
