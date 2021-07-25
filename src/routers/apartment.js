const express = require("express");
const Apartment = require("../models/apartment");
const auth = require("../middleware/auth");
const { uploadFilesToS3, getFileFromS3 } = require("../middleware/s3-handlers");
const {
  validateApartment,
  validateNewApartment,
} = require("../middleware/validateApartment");
const { Readable } = require("stream");
const sqlQueryPromise = require("../db/sqlServer");
const {
  getApartmentTypeIdQuery,
  getApartmentConditionIdQuery,
  getAllApartmentProperties,
  getApartments,
} = require("../db/sql/queries/select");
const {
  addApartment,
  addApartmentToPropertyConnection,
  addPublisher,
  addApartmentToPublisherConnection,
  addApartmentToFileConnection,
} = require("../db/sql/queries/insert");

const router = express.Router();

const rootRoute = "/apartments/";

router.post(
  rootRoute + "publish",
  auth,
  validateNewApartment,
  async (req, res) => {
    try {
      const apartmentTypeRes = await sqlQueryPromise(
        getApartmentTypeIdQuery(req.body.type)
      );
      if (apartmentTypeRes?.recordset.length === 0)
        return res.status(400).send("Type is invalid");
      req.apartment.TypeID = apartmentTypeRes.recordset[0].ApartmentTypeID;

      const apartmentConditionRes = await sqlQueryPromise(
        getApartmentConditionIdQuery(req.body.condition)
      );
      if (apartmentConditionRes?.recordset.length === 0)
        return res.status(400).send("Condition is invalid");
      req.apartment.ConditionID =
        apartmentConditionRes.recordset[0].ApartmentConditionID;

      // Add apartment
      const newParameterRes = await sqlQueryPromise(
        addApartment(req.apartment)
      );
      const apartmentId = newParameterRes?.recordset[0]?.ApartmentID;

      // Get all apartment properties
      const apartmentPropsRes = await sqlQueryPromise(
        getAllApartmentProperties()
      );
      const apartmentProps = apartmentPropsRes.recordset;

      // Create property to apartment connections
      for (const { PropertyName, ApartmentPropertyID } of apartmentProps) {
        if (
          !req.body[PropertyName[0].toLowerCase() + PropertyName.substring(1)]
        )
          continue;
        await sqlQueryPromise(
          addApartmentToPropertyConnection(ApartmentPropertyID, apartmentId)
        );
      }

      // Create publishers
      const newPublishersIds = [];

      for (publisher of req.body.publishers) {
        const newPublisherRes = await sqlQueryPromise(
          addPublisher(publisher.publisherName || null, publisher.phoneNumber)
        );
        newPublishersIds.push(
          newPublisherRes.recordset[0].ApartmentPublisherID
        );
      }

      // Create publisher to apartment connections
      for (const publisherId of newPublishersIds) {
        await sqlQueryPromise(
          addApartmentToPublisherConnection(apartmentId, publisherId)
        );
      }

      res.status(201).send(`${apartmentId}`);
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  }
);

router.post(
  rootRoute + "publish/upload-files",
  auth,
  validateApartment,
  uploadFilesToS3,
  async (req, res) => {
    if (!req.files) {
      return res.status(422).send({
        status: 422,
        message: "file not uploaded",
      });
    }

    const files = [];
    try {
      for (let reqFile of req.files) {
        console.log(reqFile.key);
        await sqlQueryPromise(
          addApartmentToFileConnection(req.query.apartmentId, reqFile.key)
        );
        files.push(reqFile.key);
      }

      res.status(201).send(files);
    } catch (err) {
      console.log(err.message, "42");
      res.status(500).send(err);
    }
  }
);

router.get(rootRoute + "get-file", getFileFromS3, async (req, res) => {
  try {
    const stream = Readable.from(req.fileBuffer);
    //const fileName = req.query.name;
    const fileName = req.query.key.substring(
      req.query.key.lastIndexOf("/") + 1
    );

    if (req.query.download === "true") {
      res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    } else {
      res.setHeader("Content-Disposition", "inline");
    }

    stream.pipe(res);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

const apartmentModelStrFields = [
  "type",
  "condition",
  "town",
  "streetName",
  "description",
  "furnitureDescription",
];
const apartmentModelBoolFields = [
  "hasAirConditioning",
  "hasFurniture",
  "isRenovated",
  "hasSafeRoom",
  "isAccessible",
  "hasKosherKitchen",
  "hasShed",
  "hasLift",
  "hasSunHeatedWaterTanks",
  "hasPandorDoors",
  "hasTadiranAc",
  "hasWindowBars",
  "isImmediate",
];
const apartmentModelNumFields = [
  "houseNum",
  "floor",
  "buildingMaxFloor",
  "numberOfRooms",
  "numberOfParkingSpots",
  "numberOfBalconies",
  "price",
  "builtSqm",
  "totalSqm",
  "date",
];

router.get(rootRoute, async (req, res) => {
  try {
    const apartmentsPollLimit = 5;
    const params = req.query;

    const a = await sqlQueryPromise(
      getApartments(
        params.town,
        params.streetName,
        params.isImmediate,
        params.description,
        params.furnitureDescription,
        params["min-houseNum"],
        params["max-houseNum"],
        params["min-floor"],
        params["max-floor"],
        params["min-buildingMaxFloor"],
        params["max-buildingMaxFloor"],
        params["min-builtSqm"],
        params["max-builtSqm"],
        params["min-totalSqm"],
        params["max-totalSqm"],
        params["min-price"],
        params["max-price"],
        params["min-date"],
        params["max-date"]
      )
    );
    console.log(a.recordset.length);

    // let query = `SELECT * FROM Apartments WHERE`;

    // const paramsEntries = Object.entries(params);
    // for (let [key, value] of paramsEntries) {
    //   switch (key) {
    //     case "town":
    //       query += ` Town = ${value} AND`;
    //       break;
    //     case "streetName":
    //       query += ` Street ='${value} AND`;
    //       break;
    //     case "isImmediate":
    //       query += ` IsEntranceImmediate = ${value ? 1 : 0} AND`;
    //       break;
    //     case "description":
    //       query += ` CHARINDEX('${value}', ApartmentDescription) > 0 AND`;
    //       break;
    //     case "furnitureDescription":
    //       query += ` CHARINDEX('${value}', FurnitureDescription) > 0 AND`;
    //       break;
    //     case "min-houseNum":
    //       query += ` HouseNum >= ${value} AND`;
    //       break;
    //     case "max-houseNum":
    //       query += ` HouseNum <= ${value} AND`;
    //       break;
    //     case "min-floor":
    //       query += ` FloorNum >= ${value} AND`;
    //       break;
    //     case "max-floor":
    //       query += ` FloorNum <= ${value} AND`;
    //       break;
    //     case "min-buildingMaxFloor":
    //       query += ` BuildingMaxFloor >= ${value} AND`;
    //       break;
    //     case "max-buildingMaxFloor":
    //       query += ` BuildingMaxFloor <= ${value} AND`;
    //       break;
    //     case "min-builtSqm":
    //       query += ` BuiltSqm >= ${value} AND`;
    //       break;
    //     case "max-builtSqm":
    //       query += ` BuiltSqm <= ${value} AND`;
    //       break;
    //     case "min-totalSqm":
    //       query += ` TotalSqm >= ${value} AND`;
    //       break;
    //     case "max-totalSqm":
    //       query += ` TotalSqm <= ${value} AND`;
    //       break;
    //     case "min-date":
    //       query += ` EntranceDate >= ${formatDateForSql(value)} AND`;
    //       break; // !Maybe need to cast DATETIME2
    //     case "max-date":
    //       query += ` EntranceDate <= ${formatDateForSql(value)} AND`;
    //       break;
    //     case "min-price":
    //       query += ` Price >= ${value} AND`;
    //       break;
    //     case "max-price":
    //       query += ` Price <= ${value} AND`;
    //       break;
    //   }
    // }
    // console.log(paramsEntries, paramsEntries.length);
    // const queryLen = query.length;
    // query =
    //   paramsEntries.length > 0
    //     ? query.substring(0, queryLen - 4)
    //     : query.substring(0, queryLen - 6);

    // console.log(query, "\n");
    // const a = await sqlQueryPromise(query);
    // console.log(a.recordset);

    res.status(200).send();
  } catch (err) {
    console.log(err.message, "138");
    res.status(500).send(err);
  }
});

module.exports = router;
