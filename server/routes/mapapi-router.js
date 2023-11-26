const express = require("express")
const router = express.Router()
const mapMetadataSchemaController = require("../controllers/mapapi-controller")
const auth = require("../auth") // auth_manager

// Handles getting map metadata by id
router.get(
    "/mapmetadata/:id",
    auth.verify,
    mapMetadataSchemaController.getMapById
)

//Handles getting all map metadata by user
router.get(
    "/mapbyuser/:id",
    auth.verify,
    mapMetadataSchemaController.getUserMaps
)

//Handles getting all map metadata (that are published)
router.get(
    "/allpublishedmap",
    auth.verify,
    mapMetadataSchemaController.getAllPublishedMaps
)

//Handles getting the geojson of the map by id
router.get(
    "/mapgeojson/:id",
    auth.verify,
    mapMetadataSchemaController.getGeoJsonById
)

//Handles gettings the field datas of a map.
router.get(
    "/mapfields/:id",
    auth.verify,
    mapMetadataSchemaController.getMapFieldsById
)

//Handles creating a new map request
router.post("/newmap",
    auth.verify,
    mapMetadataSchemaController.createNewMap)

//Handles duplicating a map (by ID) request
router.post(
    "/duplicatemap/:id",
    auth.verify,
    mapMetadataSchemaController.createDuplicateMapById
)

//Handles forking a map (by ID) request
router.post(
    "/forkmap",
    auth.verify,
    mapMetadataSchemaController.createForkMapById
)

//Handles deleting map (by ID) request
router.delete(
    "/deletemap/:id",
    auth.verify,
    mapMetadataSchemaController.deleteMapById
)

//Handles updating the name of a map (by ID) request
router.put(
    "/mapname/:id",
    auth.verify,
    mapMetadataSchemaController.updateMapNameById
)
// //Handles updating a map's tags request
// router.post(
//     "/updatemaptag",
//     auth.verify,
//     mapMetadataSchemaController.updateMapTag
// )

// //Handles updating a map's publish status request(published/unpublished)
// router.post(
//     "/publishmap",
//     auth.verify,
//     mapMetadataSchemaController.updateMapPublishStatus
// )

// router.post("/likemap", auth.verify, mapMetadataSchemaController.likeMap)

// router.post("/dislikemap", auth.verify, mapMetadataSchemaController.dislikeMap)

// router.post(
//     "/postcomment",
//     auth.verify,
//     mapMetadataSchemaController.postComment
// )

// router.post(
//     "/likecomment",
//     auth.verify,
//     mapMetadataSchemaController.likeComment
// )

module.exports = router
