const { validateApartmentQuery } = require("../db/sql/queries/exists");
const sqlQueryPromise = require("../db/sqlServer");
const formatDateForSql = require("../utils/formatDateForSql");

const validateApartment = async (req, res, next) => {
    const apartmentId = req.query.apartmentId;
    if (!apartmentId) return res.status(400).send("Must include apartment's object id");

    try {
        const doesApartmentExistRes = await sqlQueryPromise(validateApartmentQuery(apartmentId));
        if (!doesApartmentExistRes?.recordset[0]?.doesApartmentExist)
            return res.status(400).send("Apartment was not found");
        next();
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
};

const getOptionalApartmentProp = (prop) => {
    if (!!prop) return prop;
    return null;
};

const validateNewApartment = async (req, res, next) => {
    if (!req.body.publishers || req.body.publishers.length === 0)
        return res
            .status(400)
            .send(
                "Apartment's publishers are missing, must include at least one (name, phone number)"
            );

    try {
        const apartment = {
            Town: req.body.town,
            Street: getOptionalApartmentProp(req.body.streetName),

            HouseNum: req.body.houseNum,
            FloorNum: req.body.floor,
            BuildingMaxFloor: req.body.buildingMaxFloor,

            NumberOfRooms: req.body.numberOfRooms,
            NumberOfParkingSpots: req.body.numberOfParkingSpots || 0,
            NumberOfBalconies: req.body.numberOfBalconies || 0,
            ApartmentDescription: getOptionalApartmentProp(req.body.description),
            FurnitureDescription: getOptionalApartmentProp(req.body.furnitureDescription),

            Price: req.body.price,
            BuiltSqm: getOptionalApartmentProp(req.body.builtSqm),
            TotalSqm: req.body.totalSqm,

            EntranceDate: formatDateForSql(req.body.date) || formatDateForSql(Date.now()),
            IsEntranceImmediate: req.body.isImmediate ? 1 : 0,

            Email: req.body.contactEmail,
            PublisherUserID: req.user.UserID,
        };

        req.IsStandingOnPolls = req.body.isStandingOnPolls;
        req.HasAirConditioning = req.body.hasAirConditioning;
        req.IsRenovated = req.body.isRenovated;
        req.HasSafeRoom = req.body.hasSafeRoom;
        req.IsAccessible = req.body.isAccessible;
        req.HasKosherKitchen = req.body.hasKosherKitchen;
        req.HasShed = req.body.hasShed;
        req.HasLift = req.body.hasLift;
        req.HasSunHeatedWaterTanks = req.body.hasSunHeatedWaterTanks;
        req.HasPandorDoors = req.body.hasPandorDoors;
        req.HasTadiranAc = req.body.hasTadiranAc;
        req.HasWindowBars = req.body.hasWindowBars;

        if (!apartment.Town) return res.status(400).send("Apartment's town is missing");
        if (!apartment.HouseNum && apartment.HouseNum !== 0)
            return res.status(400).send("House number is missing");
        if (!apartment.FloorNum && apartment.FloorNum !== 0)
            return res.status(400).send("Apartment's floor number is missing");
        if (!apartment.BuildingMaxFloor && apartment.BuildingMaxFloor !== 0)
            return res.status(400).send("Building's top floor is missing");
        if (!apartment.Price) return res.status(400).send("Price is not specified");
        if (!apartment.TotalSqm) return res.status(400).send("Total sqm is missing");

        if (!req.body.type) return res.status(400).send("Apartment's type sqm is missing");
        if (!req.body.condition) return res.status(400).send("Apartment's condition is missing");

        req.apartment = apartment;

        next();
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
};

module.exports = { validateApartment, validateNewApartment };
