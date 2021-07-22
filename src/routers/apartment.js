const express = require("express");
const Apartment = require("../models/apartment");
const auth = require("../middleware/auth");
const FileModel = require("../models/file");
const { uploadFilesToS3, getFileFromS3 } = require("../middleware/s3-handlers");
const {
  validateApartment,
  validateNewApartment,
} = require("../middleware/validateApartment");
const { Readable } = require("stream");
const getApartmentObj = require("../utils/getApartmentObj");
const sqlQueryPromise = require("../db/sqlServer");
const {
  getApartmentTypeIdQuery,
  getApartmentConditionIdQuery,
  getAllApartmentProperties,
} = require("../db/sql/queries/select");
const {
  addApartment,
  addApartmentToTypeConnection,
  addApartmentToPropertyConnection,
  addPublisher,
  addApartmentToPublisherConnection,
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

    try {
      for (let reqFile of req.files) {
        // let file = new FileModel({
        //   originalName: reqFile.originalname,
        //   storageName: reqFile.key.split("/")[1],
        //   bucket: process.env.S3_BUCKET,
        //   region: process.env.AWS_REGION,
        //   key: reqFile.key,
        //   type: reqFile.mimetype,
        //   owner: req.query.apartmentId,
        //   isMainFile: isFirstFileOfApartment,
        // });
      }

      res.status(201).send(files);
    } catch (err) {
      console.log(err.message, "42");
      res.status(500).send(err);
    }
  }
);

const apartmentModelStrFields = [
  "type",
  "condition",
  "town",
  "streetName",
  "description",
  "furnitureDescription",
];
const apartmentModelBoolFields = [
  // 'isStandingOnPolls',
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
  // 'canBeInContactOnWeekends'
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
  const apartmentsPollLimit = 5;
  const params = req.query;
  if (!params.apartmentIds) params.apartmentIds = [];
  if (!params.types) params.types = [];
  if (!params.conditions) params.conditions = [];

  let strAndBoolQueries = [];
  let numericQueries = [];
  let orQueries = [];

  for (let [key, value] of Object.entries(params)) {
    let modelKey;
    if (
      apartmentModelStrFields.includes(key) ||
      apartmentModelBoolFields.includes(key)
    ) {
      if (key === "town" || key === "streetName") modelKey = `location.${key}`;
      else if (key === "isImmediate") modelKey = `entranceDate.${key}`;
      else modelKey = `properties.${key}`;

      if (key === "description") {
        strAndBoolQueries.push({
          [`${modelKey}`]: {
            $regex: `${value.substring(0, 400)}`,
          },
        });
        continue;
      }

      strAndBoolQueries.push({
        [`${modelKey}`]: value,
      });

      continue;
    }

    let field = key.substring(4); // "Omits the min- or max- label"
    if (apartmentModelNumFields.includes(field)) {
      if (!apartmentModelNumFields.includes(field)) continue; // !! find({ airedAt: { $gte: '1987-10-19', $lte: '1987-10-26' } }). DATE FORMAT

      if (
        field === "houseNum" ||
        field === "floor" ||
        field === "buildingMaxFloor"
      )
        modelKey = `location.${field}`;
      else if (field === "builtSqm" || field === "totalSqm")
        modelKey = `size.${field}`;
      else if (field === "date") modelKey = `entranceDate.${field}`;
      else if (field === "price") modelKey = field;
      else modelKey = `properties.${field}`;

      let isMin = key.substring(0, 3) === "min";
      isMin
        ? numericQueries.push({
            [modelKey]: {
              $gte: value,
            },
          })
        : numericQueries.push({
            [modelKey]: {
              $lte: value,
            },
          });
    }
  }

  for (let type of params.types) {
    orQueries.push({ type: type });
  }
  for (let condition of params.conditions) {
    orQueries.push({ condition: condition });
  }

  try {
    const apartments = await Apartment.find({
      $and: [
        ...strAndBoolQueries,
        ...numericQueries,
        orQueries.length > 0
          ? {
              $or: [...orQueries],
            }
          : {},
        {
          _id: {
            $nin: [...params.apartmentIds],
          },
        },
      ],
    }).limit(apartmentsPollLimit);

    let populateFilesPromises = [];
    for (apartment of apartments) {
      populateFilesPromises.push(apartment.populate("files").execPopulate());
    }
    await Promise.allSettled(populateFilesPromises);
    let apartmentObjects = apartments.map((apartment) => ({
      apartment,
      files: apartment.files || [],
    }));

    res.status(200).send(apartmentObjects || []);
  } catch (err) {
    console.log(err.message, "138");
    res.status(500).send(err);
  }
});

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

module.exports = router;
