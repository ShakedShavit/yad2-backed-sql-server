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

const getApartmentTypeIdProc = () => {
  return `
      CREATE OR ALTER PROCEDURE dbo.sp_get_apartment_type
      @type NVARCHAR(50)
      AS
          SELECT ApartmentTypeID FROM ApartmentTypes
          WHERE Type = @type
      RETURN;
  `;
};

const getApartmentConditionIdProc = () => {
  return `
      CREATE OR ALTER PROCEDURE dbo.sp_get_apartment_condition
      @condition NVARCHAR(50)
      AS
          SELECT ApartmentConditionID FROM ApartmentConditions
          WHERE Condition = @condition
      RETURN;
  `;
};

module.exports = {
  getUserByEmailProc,
  getUserByIdProc,
  getApartmentTypeIdProc,
  getApartmentConditionIdProc,
};
