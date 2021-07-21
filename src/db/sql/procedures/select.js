const getUserByEmailProc = () => {
  return `
            CREATE OR ALTER PROCEDURE dbo.sp_get_user
            @Email NVARCHAR(50)
            AS
                SELECT * FROM Users
                WHERE Email = @Email
            RETURN;
        `;
};

const getUserByIdProc = () => {
  return `
              CREATE OR ALTER PROCEDURE dbo.sp_get_user_by_id
              @id INT
              AS
                  SELECT * FROM Users
                  WHERE UserID = @id
              RETURN;
          `;
};

module.exports = {
  getUserByEmailProc,
  getUserByIdProc,
};
