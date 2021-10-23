const express = require("express");
const auth = require("../middleware/auth");
const { uploadFilesToS3, getFileFromS3 } = require("../middleware/s3-handlers");
const { validateApartment, validateNewApartment } = require("../middleware/validateApartment");
const { Readable } = require("stream");
const sqlQueryPromise = require("../db/sqlServer");
const {
    getApartmentTypeIdQuery,
    getApartmentConditionIdQuery,
    getAllApartmentProperties,
    getApartments,
    getAllSpecificApartmentProperties,
    getAllSpecificApartmentFiles,
    getAllSpecificApartmentPublishers,
} = require("../db/sql/queries/select");
const {
    addApartment,
    addApartmentToPropertyConnection,
    addPublisher,
    addApartmentToPublisherConnection,
    addApartmentToFileConnection,
} = require("../db/sql/queries/insert");
const getApartmentObj = require("../utils/getApartmentObj");

const router = express.Router();

const rootRoute = "/apartments/";

router.post(rootRoute + "publish", auth, validateNewApartment, async (req, res) => {
    try {
        const apartmentTypeRes = await sqlQueryPromise(getApartmentTypeIdQuery(req.body.type));
        if (apartmentTypeRes?.recordset.length === 0)
            return res.status(400).send("Type is invalid");
        req.apartment.TypeID = apartmentTypeRes.recordset[0].ApartmentTypeID;

        const apartmentConditionRes = await sqlQueryPromise(
            getApartmentConditionIdQuery(req.body.condition)
        );
        if (apartmentConditionRes?.recordset.length === 0)
            return res.status(400).send("Condition is invalid");
        req.apartment.ConditionID = apartmentConditionRes.recordset[0].ApartmentConditionID;

        // Add apartment
        const newParameterRes = await sqlQueryPromise(addApartment(req.apartment));
        const apartmentId = newParameterRes?.recordset[0]?.ApartmentID;

        // Get all apartment properties
        const apartmentPropsRes = await sqlQueryPromise(getAllApartmentProperties());
        const apartmentProps = apartmentPropsRes.recordset;

        // Create property to apartment connections
        for (const { PropertyName, ApartmentPropertyID } of apartmentProps) {
            if (!req.body[PropertyName[0].toLowerCase() + PropertyName.substring(1)]) continue;

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
            newPublishersIds.push(newPublisherRes.recordset[0].ApartmentPublisherID);
        }

        // Create publisher to apartment connections
        for (const publisherId of newPublishersIds) {
            await sqlQueryPromise(addApartmentToPublisherConnection(apartmentId, publisherId));
        }

        res.status(201).send(`${apartmentId}`);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});

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

        const fileName = req.query.key.substring(req.query.key.lastIndexOf("/") + 1);

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

const getPropsArr = async (query) => {
    const properties = [];
    const propertiesRes = await sqlQueryPromise(getAllApartmentProperties());
    propertiesRes?.recordset.forEach((prop) => {
        const propName = prop.PropertyName;
        if (query[propName.charAt(0).toLowerCase() + propName.slice(1)] === "true")
            properties.push(propName);
    });
    return properties;
};

router.get(rootRoute, async (req, res) => {
    try {
        const apartmentsPollLimit = 5;
        const params = req.query;
        const properties = await getPropsArr({ ...params });

        const apartmentsRes = await sqlQueryPromise(
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
                params["max-date"],
                params.types,
                params.conditions,
                properties,
                apartmentsPollLimit,
                params.skipCounter || 0
            )
        );

        const apartments = [];
        console.log(apartmentsRes.recordset[0], apartmentsRes.recordset.length);

        for (const apartment of apartmentsRes.recordset) {
            const apartmentId = apartment.ApartmentID;

            const apartmentPropsRes = await sqlQueryPromise(
                getAllSpecificApartmentProperties(apartmentId)
            );
            const apartmentPublishersRes = await sqlQueryPromise(
                getAllSpecificApartmentPublishers(apartmentId)
            );
            const apartmentFilesRes = await sqlQueryPromise(
                getAllSpecificApartmentFiles(apartmentId)
            );

            apartments.push({
                apartment: getApartmentObj(
                    apartment,
                    apartmentPropsRes?.recordset,
                    apartmentPublishersRes?.recordset
                ),
                files: apartmentFilesRes?.recordset || [],
            });
        }

        res.status(200).send(apartments);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
