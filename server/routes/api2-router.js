const express = require("express")
const router = express.Router()
const mapGraphicSchemaController = require("../controllers/api-controller")
const auth = require("../auth") // auth_manager

// Handles getting map metadata by id
router.get(
    "/mapmetadata/:id",
    auth.verify,
    mapGraphicSchemaController.getMapById
)

//Handles getting all map metadata by user
router.get(
    "/mapbyuser/:id",
    auth.verify,
    mapGraphicSchemaController.getUserMaps
)

//Handles getting all map metadata (that are published)
router.get(
    "/allpublishedmap",
    auth.verify,
    mapGraphicSchemaController.getAllMaps
)

//Handles getting the geojson of the map by id
router.get(
    "/mapgeojson/:id",
    auth.verify,
    mapGraphicSchemaController.getMapJsonById
)

//Handles creating a new map request
router.post("/newmap", auth.verify, mapGraphicSchemaController.createNewMap)

//Handles duplicating a map (by ID) request
router.post(
    "/duplicatemap",
    auth.verify,
    mapGraphicSchemaController.createDuplicateMapById
)

//Handles forking a map (by ID) request
router.post(
    "/forkmap",
    auth.verify,
    mapGraphicSchemaController.createForkMapById
)

//Handles deleting map (by ID) request
router.delete(
    "/deletemap/:id",
    auth.verify,
    mapGraphicSchemaController.deleteMapById
)

//Handles updating the name of a map (by ID) request
router.post(
    "/updatemapname",
    auth.verify,
    mapGraphicSchemaController.updateMapNameById
)

//Handles updating a map's tags request
router.post(
    "/updatemaptag",
    auth.verify,
    mapGraphicSchemaController.updateMapTag
)

//Handles updating a map's publish status request(published/unpublished)
router.post(
    "/mapstatus",
    auth.verify,
    mapGraphicSchemaController.updateMapPublishStatus
)

module.exports = router
