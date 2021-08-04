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
          SET @Where = @Where + ' Town=@TownDyn AND'
        IF (@Street IS NOT NULL)
          SET @Where = @Where + ' Street=@StreetDyn AND'
        IF (@IsEntranceImmediate IS NOT NULL)
          SET @Where = @Where + ' IsEntranceImmediate=CONVERT(VARCHAR(12), @IsEntranceImmediateDyn) AND'

        IF (@ApartmentDescription IS NOT NULL)
          SET @Where = @Where + ' CHARINDEX(@ApartmentDescriptionDyn, ApartmentDescription) > 0 AND'
        IF (@FurnitureDescription IS NOT NULL)
          SET @Where = @Where + ' CHARINDEX(@FurnitureDescriptionDyn, FurnitureDescription) > 0 AND'
        

        IF (@MinHouseNum IS NOT NULL)
          SET @Where = @Where + ' HouseNum >= CONVERT(VARCHAR(12), @MinHouseNumDyn) AND' 
        IF (@MaxHouseNum IS NOT NULL)
          SET @Where = @Where + ' HouseNum <= CONVERT(VARCHAR(12), @MaxHouseNumDyn) AND'
        IF (@MinFloorNum IS NOT NULL)
          SET @Where = @Where + ' FloorNum >= CONVERT(VARCHAR(12), @MinFloorNumDyn) AND'
        IF (@MaxFloorNum IS NOT NULL)
          SET @Where = @Where + ' FloorNum <= CONVERT(VARCHAR(12), @MaxFloorNumDyn) AND'
        IF (@MinBuildingMaxFloor IS NOT NULL)
          SET @Where = @Where + ' BuildingMaxFloor >= CONVERT(VARCHAR(12), @MinBuildingMaxFloorDyn) AND'
        IF (@MaxBuildingMaxFloor IS NOT NULL)
          SET @Where = @Where + ' BuildingMaxFloor <= CONVERT(VARCHAR(12), @MaxBuildingMaxFloorDyn) AND'
        IF (@MinBuiltSqm IS NOT NULL)
          SET @Where = @Where + ' BuiltSqm >= CONVERT(VARCHAR(12), @MinBuiltSqmDyn) AND'
        IF (@MaxBuiltSqm IS NOT NULL)
          SET @Where = @Where + ' BuiltSqm <= CONVERT(VARCHAR(12), @MaxBuiltSqmDyn) AND'
        IF (@MinTotalSqm IS NOT NULL)
          SET @Where = @Where + ' TotalSqm >= CONVERT(VARCHAR(12), @MinTotalSqmDyn) AND'
        IF (@MaxTotalSqm IS NOT NULL)
          SET @Where = @Where + ' TotalSqm <= CONVERT(VARCHAR(12), @MaxTotalSqmDyn) AND'
        IF (@MinPrice IS NOT NULL)
          SET @Where = @Where + ' Price >= CONVERT(VARCHAR(12), @MinPriceDyn) AND'
        IF (@MaxPrice IS NOT NULL)
          SET @Where = @Where + ' Price <= CONVERT(VARCHAR(12), @MaxPriceDyn) AND'
        IF (@MinEntranceDate IS NOT NULL)
          SET @Where = @Where + ' EntranceDate >= CONVERT(VARCHAR(50), @MinEntranceDateDyn) AND'
        IF (@MaxEntranceDate IS NOT NULL)
          SET @Where = @Where + ' EntranceDate <= CONVERT(VARCHAR(50), @MaxEntranceDateDyn) AND'


        IF (@Types IS NOT NULL)
          SET @Where = @Where + ' CHARINDEX(Type, @TypesDyn) > 0 AND'
        IF (@Conditions IS NOT NULL)
          SET @Where = @Where + ' CHARINDEX(Condition, @ConditionsDyn) > 0 AND'


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
        OFFSET CONVERT(INT, @SkipCounterDyn) ROWS
        FETCH NEXT CONVERT(INT, @PollLimitDyn) ROWS ONLY'
        
        Execute SP_ExecuteSQL @Command, N'
        @TownDyn NVARCHAR(50),
        @StreetDyn NVARCHAR(50),
        @IsEntranceImmediateDyn BIT,
        @ApartmentDescriptionDyn NVARCHAR(400),
        @FurnitureDescriptionDyn NVARCHAR(400),
        @MinHouseNumDyn INT,
        @MaxHouseNumDyn INT,
        @MinFloorNumDyn INT,
        @MaxFloorNumDyn INT,
        @MinBuildingMaxFloorDyn INT,
        @MaxBuildingMaxFloorDyn INT,
        @MinBuiltSqmDyn FLOAT,
        @MaxBuiltSqmDyn FLOAT,
        @MinTotalSqmDyn FLOAT,
        @MaxTotalSqmDyn FLOAT,
        @MinPriceDyn FLOAT,
        @MaxPriceDyn FLOAT,
        @MinEntranceDateDyn DATETIME2,
        @MaxEntranceDateDyn DATETIME2,
        @TypesDyn NVARCHAR(MAX),
        @ConditionsDyn NVARCHAR(MAX),
        @PropertiesDyn NVARCHAR(MAX),
        @PollLimitDyn INT,
        @SkipCounterDyn INT',

        @TownDyn=@Town,
        @StreetDyn=@Street,
        @IsEntranceImmediateDyn=@IsEntranceImmediate,
        @ApartmentDescriptionDyn=@ApartmentDescription,
        @FurnitureDescriptionDyn=@FurnitureDescription,
        @MinHouseNumDyn=@MinHouseNum,
        @MaxHouseNumDyn=@MaxHouseNum,
        @MinFloorNumDyn=@MinFloorNum,
        @MaxFloorNumDyn=@MaxFloorNum,
        @MinBuildingMaxFloorDyn=@MinBuildingMaxFloor,
        @MaxBuildingMaxFloorDyn=@MaxBuildingMaxFloor,
        @MinBuiltSqmDyn=@MinBuiltSqm,
        @MaxBuiltSqmDyn=@MaxBuiltSqm,
        @MinTotalSqmDyn=@MinTotalSqm,
        @MaxTotalSqmDyn=@MaxTotalSqm,
        @MinPriceDyn=@MinPrice,
        @MaxPriceDyn=@MaxPrice,
        @MinEntranceDateDyn=@MinEntranceDate,
        @MaxEntranceDateDyn=@MaxEntranceDate,
        @TypesDyn=@Types,
        @ConditionsDyn=@Conditions,
        @PropertiesDyn=@Properties,
        @PollLimitDyn=@PollLimit,
        @SkipCounterDyn=@SkipCounter

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
