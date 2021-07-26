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

const getApartmentsProc = () => {
  return `
      CREATE OR ALTER PROCEDURE dbo.sp_get_apartments
      @Town NVARCHAR(50) = NULL,
      @Street NVARCHAR(50) = NULL,
      @IsEntranceImmediate BIT = NULL,
      @ApartmentDescription NVARCHAR(400) = NULL,
      @FurnitureDescription NVARCHAR(400) = NULL,
      @MinHouseNum INT = NULL,
      @MaxHouseNum INT = NULL,
      @MinFloorNum INT = NULL,
      @MaxFloorNum INT = NULL,
      @MinBuildingMaxFloor INT = NULL,
      @MaxBuildingMaxFloor INT = NULL,
      @MinBuiltSqm FLOAT = NULL,
      @MaxBuiltSqm FLOAT = NULL,
      @MinTotalSqm FLOAT = NULL,
      @MaxTotalSqm FLOAT = NULL,
      @MinPrice FLOAT = NULL,
      @MaxPrice FLOAT = NULL,
      @MinEntranceDate DATETIME2 = NULL,
      @MaxEntranceDate DATETIME2 = NULL,
      @Types NVARCHAR(MAX) = NULL,
      @Conditions NVARCHAR(MAX) = NULL,
      @Properties NVARCHAR(MAX) = NULL,
      @PollLimit INT = 5,
      @SkipCounter INT = 0
      AS
        DECLARE @Where NVARCHAR(MAX)
        SET @Where = ' ApartmentID > 0 AND'

        IF (@Town IS NOT NULL)
          SET @Where = @Where + ' Town = ''' + @Town + ''' AND'
        IF (@Street IS NOT NULL)
          SET @Where = @Where + ' Street = ''' + @Street + ''' AND'
        IF (@IsEntranceImmediate IS NOT NULL)
          SET @Where = @Where + ' IsEntranceImmediate = ' + CONVERT(VARCHAR(12), @IsEntranceImmediate) + ' AND'

        IF (@ApartmentDescription IS NOT NULL)
          SET @Where = @Where + ' CHARINDEX(''' + @ApartmentDescription + ''', ApartmentDescription) > 0 AND'
        IF (@FurnitureDescription IS NOT NULL)
          SET @Where = @Where + ' CHARINDEX(''' + @FurnitureDescription + ''', FurnitureDescription) > 0 AND'
        

        IF (@MinHouseNum IS NOT NULL)
          SET @Where = @Where + ' HouseNum >= ' + CONVERT(VARCHAR(12), @MinHouseNum) + ' AND' 
        IF (@MaxHouseNum IS NOT NULL)
          SET @Where = @Where + ' HouseNum <= ' + CONVERT(VARCHAR(12), @MaxHouseNum) + ' AND'
        IF (@MinFloorNum IS NOT NULL)
          SET @Where = @Where + ' FloorNum >= ' + CONVERT(VARCHAR(12), @MinFloorNum) + ' AND'
        IF (@MaxFloorNum IS NOT NULL)
          SET @Where = @Where + ' FloorNum <= ' + CONVERT(VARCHAR(12), @MaxFloorNum) + ' AND'
        IF (@MinBuildingMaxFloor IS NOT NULL)
          SET @Where = @Where + ' BuildingMaxFloor >= ' + CONVERT(VARCHAR(12), @MinBuildingMaxFloor) + ' AND'
        IF (@MaxBuildingMaxFloor IS NOT NULL)
          SET @Where = @Where + ' BuildingMaxFloor <= ' + CONVERT(VARCHAR(12), @MaxBuildingMaxFloor) + ' AND'
        IF (@MinBuiltSqm IS NOT NULL)
          SET @Where = @Where + ' BuiltSqm >= ' + CONVERT(VARCHAR(12), @MinBuiltSqm) + ' AND'
        IF (@MaxBuiltSqm IS NOT NULL)
          SET @Where = @Where + ' BuiltSqm <= ' + CONVERT(VARCHAR(12), @MaxBuiltSqm) + ' AND'
        IF (@MinTotalSqm IS NOT NULL)
          SET @Where = @Where + ' TotalSqm >= ' + CONVERT(VARCHAR(12), @MinTotalSqm) + ' AND'
        IF (@MaxTotalSqm IS NOT NULL)
          SET @Where = @Where + ' TotalSqm <= ' + CONVERT(VARCHAR(12), @MaxTotalSqm) + ' AND'
        IF (@MinPrice IS NOT NULL)
          SET @Where = @Where + ' Price >= ' + CONVERT(VARCHAR(12), @MinPrice) + ' AND'
        IF (@MaxPrice IS NOT NULL)
          SET @Where = @Where + ' Price <= ' + CONVERT(VARCHAR(12), @MaxPrice) + ' AND'
        IF (@MinEntranceDate IS NOT NULL)
          SET @Where = @Where + ' EntranceDate >= ''' + CONVERT(VARCHAR(50), @MinEntranceDate) + ''' AND'
        IF (@MaxEntranceDate IS NOT NULL)
          SET @Where = @Where + ' EntranceDate <= ''' + CONVERT(VARCHAR(50), @MaxEntranceDate) + ''' AND'


        IF (@Types IS NOT NULL)
          SET @Where = @Where + ' CHARINDEX(Type, ''' + @Types + ''') > 0 AND'
        IF (@Conditions IS NOT NULL)
          SET @Where = @Where + ' CHARINDEX(Condition, ''' + @Conditions + ''') > 0 AND'


        DECLARE @S NVARCHAR(MAX)
        SET @S = @Properties
        WHILE LEN(@S) > 0
        BEGIN
          SET @Where = @Where + ' 
            Apartments.ApartmentID IN (SELECT ApartmentsToPropertiesConnections.ApartmentID 
            FROM ApartmentsToPropertiesConnections 
            WHERE ApartmentPropertyID = (SELECT ApartmentProperties.ApartmentPropertyID
            FROM ApartmentProperties
            WHERE PropertyName = ''' + LEFT(@S, CHARINDEX(',', @S + ',') - 1) + ''')) AND'
          SET @S = STUFF(@S, 1, CHARINDEX(',', @S+','), '')
        END


        IF (RIGHT(@Where, 3) = 'AND')
          SET @Where = SUBSTRING(@Where, 0, LEN(@Where) - 3)

        DECLARE @Command NVARCHAR(MAX)
        SET @Command = '
        SELECT Apartments.*, ApartmentTypes.Type, ApartmentConditions.Condition
        FROM ((Apartments
        INNER JOIN ApartmentTypes ON Apartments.TypeID = ApartmentTypes.ApartmentTypeID)
        INNER JOIN ApartmentConditions ON Apartments.ConditionID = ApartmentConditions.ApartmentConditionID)
        WHERE' + @Where + ' ORDER BY Apartments.CreatedAt
        OFFSET ' + CONVERT(VARCHAR(12), @SkipCounter) + ' ROWS
        FETCH NEXT ' + CONVERT(VARCHAR(12), @PollLimit) + ' ROWS ONLY'
        
        Execute SP_ExecuteSQL @Command

      RETURN;
  `;
};
// Execute SP_ExecuteSQL @Command
// @Types NVARCHAR(MAX) = NULL,
//       @Conditions NVARCHAR(MAX) = NULL,

const getApartmentPropsProc = () => {
  return `
      CREATE OR ALTER PROCEDURE dbo.sp_get_apartment_props
      @ApartmentID NVARCHAR(50)
      AS
          SELECT ApartmentProperties.PropertyName
          FROM ApartmentsToPropertiesConnections
          INNER JOIN ApartmentProperties
          ON ApartmentProperties.ApartmentPropertyID = ApartmentsToPropertiesConnections.ApartmentPropertyID
          WHERE ApartmentID = @ApartmentID
      RETURN;
  `;
};

const getApartmentPublishersProc = () => {
  return `
      CREATE OR ALTER PROCEDURE dbo.sp_get_apartment_publishers
      @ApartmentID NVARCHAR(50)
      AS
          SELECT ApartmentPublishers.PublisherName, ApartmentPublishers.PhoneNumber
          FROM ApartmentsToPublishersConnections
          INNER JOIN ApartmentPublishers
          ON ApartmentPublishers.ApartmentPublisherID = ApartmentsToPublishersConnections.ApartmentPublisherID
          WHERE ApartmentID = @ApartmentID
      RETURN;
  `;
};

const getApartmentFilesProc = () => {
  return `
      CREATE OR ALTER PROCEDURE dbo.sp_get_apartment_files
      @ApartmentID NVARCHAR(50)
      AS
          SELECT ApartmentsToFilesConnections.FileKey
          FROM ApartmentsToFilesConnections
          WHERE ApartmentID = @ApartmentID
      RETURN;
  `;
};

module.exports = {
  getUserByEmailProc,
  getUserByIdProc,
  getApartmentTypeIdProc,
  getApartmentConditionIdProc,
  getApartmentsProc,
  getApartmentPropsProc,
  getApartmentPublishersProc,
  getApartmentFilesProc,
};

// SELECT * FROM Apartments WHERE CHARINDEX(@ApartmentDescription, ApartmentDescription) > 0

// IF (@ApartmentDescription IS NOT NULL)
//           SET @Where = @Where + ' AND CHARINDEX('@ApartmentDescription', ApartmentDescription) > 0'
//         IF (@FurnitureDescription IS NOT NULL)
//           SET @Where = @Where + ' AND CHARINDEX('@FurnitureDescription', FurnitureDescription) > 0'

// DECLARE @S NVARCHAR(MAX)
//     SET @S = @Properties
//     WHILE LEN(@S) > 0
//     BEGIN
//       SET @Where = @Where + ' Apartments.ApartmentID IN (SELECT ApartmentsToPropertiesConnections.ApartmentID FROM ApartmentsToPropertiesConnections WHERE ApartmentPropertyID = ''' +
//       LEFT(@S, CHARINDEX(',', @S + ',') - 1)
//       + ''') AND'
//       SET @S = STUFF(@S, 1, CHARINDEX(',', @S+','), '')
//     END
