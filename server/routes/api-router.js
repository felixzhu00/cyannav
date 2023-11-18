const express = require("express")
const router = express.Router()
const mapGraphicSchemaController = require("../controllers/api-controller")
const auth = require("../auth") // auth_manager

//Handles getting an existing map(by ID) request
router.get("/map/:id", auth.verify, mapGraphicSchemaController.getMapById)

//Handles getting all maps made by a specific user request
router.get(
    "/mapbyuser/:id",
    auth.verify,
    mapGraphicSchemaController.getUserMaps
)

//Handles getting all maps
router.get("/allmap", auth.verify, mapGraphicSchemaController.getAllMaps)

//Handles getting the geojson of the map
router.get(
    "/mapjson/:id",
    auth.verify,
    mapGraphicSchemaController.getMapJsonById
)

//Handles creating a new map request
router.post("/newmap", auth.verify, mapGraphicSchemaController.createNewMap)

//Handles duplicating a map(by ID) request
router.post(
    "/duplicatemap",
    auth.verify,
    mapGraphicSchemaController.createDuplicateMapById
)

//Handles forking a map(by ID) request
router.post(
    "/forkmap",
    auth.verify,
    mapGraphicSchemaController.createForkMapById
)

//Handles deleting map(by ID) request
router.delete(
    "/deletemap/:id",
    auth.verify,
    mapGraphicSchemaController.deleteMapById
)

//Handles updating the name of a map (by ID) request
router.post(
    "/mapname",
    auth.verify,
    mapGraphicSchemaController.updateMapNameById
)

//Handles updating a map's tags request
router.post("/maptag", auth.verify, mapGraphicSchemaController.updateMapTag)

//Handles updating a map's publish status request(created? unfinished? published? etc)
router.post(
    "/mapstatus",
    auth.verify,
    mapGraphicSchemaController.updateMapPublishStatus
)

//Handles updating a map's json when edited request
router.post("/mapjson", auth.verify, mapGraphicSchemaController.updateMapJson)

module.exports = router
