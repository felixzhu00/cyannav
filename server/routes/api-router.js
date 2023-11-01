const express = require('express')
const router = express.Router()
const mapGraphicSchemaController = require('../controllers/api-controller')


//Handles getting an existing map(by ID) request
router.get('/api/map:id', auth.verify, mapGraphicSchemaController.getMapById)

//Handles getting all maps made by a specific user request
router.get('/api/user:userId', auth.verify, mapGraphicSchemaController.getUserMaps)
 
//Handles getting 
router.get('/api/allmap', auth.verify, mapGraphicSchemaController.getAllMaps) 

//Handles getting all existing maps request
router.get('/api/mapjson:id', auth.verify, mapGraphicSchemaController.getMapJsonbyId)

//Handles creating a new map request
router.post('/api/newmap', auth.verify, mapGraphicSchemaController.createNewMap)

//Handles duplicating a map(by ID) request
router.post('/api/duplicatemap', auth.verify, mapGraphicSchemaController.createDuplicateMapById)

//Handles forking a map(by ID) request
router.post('/api/forkmap', auth.verify, mapGraphicSchemaController.createForkMapById)

//Handles deleting map(by ID) request
router.delete('/map:id', auth.verify, mapGraphicSchemaController.deleteMapById)

//Handles updating the name of a map (by ID) request
router.put('/api/mapname:id', auth.verify, mapGraphicSchemaController.updateMapNameById)

//Handles updating a map's tags request
router.put('/api/maptag:id', auth.verify, mapGraphicSchemaController.upateMapTag)

//Handles updating a map's publish status request(created? unfinished? published? etc)
router.put('/api/mapstatus', auth.verify, mapGraphicSchemaController.updateMapPublishStatus)

//Handles updating a map's json when edited request
router.put('/api/mapjson:id', auth.verify, mapGraphicSchemaController.updateMapJson)

module.exports = router