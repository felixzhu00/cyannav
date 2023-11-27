const MapMetadata = require("../schemas/Map/mapMetadataSchema")
const GeoJsonSchema = require("../schemas/Map/geoJsonSchema")
const MapFields = require("../schemas/Map/fieldDataSchema")

const mongoose = require("mongoose")

getMapById = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).end()
        }

        const targetMap = await MapMetadata.findOne({ _id: id })
        if (!targetMap) {
            return res.status(404).end()
        }

        if (
            !targetMap.published &&
            targetMap.user.toString() !== res.locals.userId
        ) {
            return res.status(401).end()
        }

        return res.status(200).json({
            metadata: targetMap,
        })
    } catch (err) {
        console.error("mapapi-controller::getMapById")
        console.error(err)
        return res.status(500).end()
    }
}

getUserMaps = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).end()
        }

        var userMaps
        if (res.locals.userId === id) {
            // get all my maps
            userMaps = await MapMetadata.find({ user: id })
        } else {
            userMaps = await MapMetadata.find({
                // search by user id
                user: id,
                published: true,
            })
        }

        return res.status(200).json({
            userMaps: userMaps,
        })
    } catch (err) {
        console.error("mapapi-controller::getUserMaps")
        console.error(err)
        return res.status(500).end()
    }
}

getAllPublishedMaps = async (req, res) => {
    try {
        const publishedMaps = await MapMetadata.find({ published: true })
        return res.status(200).json({
            publishedMaps: publishedMaps,
        })
    } catch (err) {
        console.error("mapapi-controller::getAllPublishedMaps")
        console.error(err)
        return res.status(500).end()
    }
}

getGeoJsonById = async (req, res) => {
    try {
        const { id } = req.body

        const GeoJsonSchema = await GeoJsonSchema.findById(id)

        if (!GeoJsonSchema) {
            return res.status(404).end()
        }

        return res.status(200).json({
            geoBuf: GeoJsonSchema.buf, // TODO: (later) figure out geobuf
        })
    } catch (err) {
        console.error("mapapi-controller::getGeoJsonSchemaById")
        console.error(err)
        return res.status(500).end()
    }
}

getMapFieldsById = async (req, res) => {
    try {
        const { id } = req.body

        const mapFields = await MapFields.findById(id)

        if (!mapFields) {
            return res.status(404).end()
        }

        return res.status(200).json({
            mapFields: mapFields, // TODO: (later) figure out how this schema works
        })
    } catch (err) {
        console.error("mapapi-controller::getMapFieldsById")
        console.error(err)
        return res.status(500).end()
    }
}

createNewMap = async (req, res) => {
    try {
        const { title, type, GeoJsonSchemabuf } = req.body
        let bufferArray = Object.values(GeoJsonSchemabuf)
        let buffer = Buffer.from(bufferArray)
        console.log(title, type, GeoJsonSchemabuf)
        if (!title || !type || !GeoJsonSchemabuf) {
            return res.status(400).json({
                errorMessage: "Invalid request.",
            })
        }

        if (
            type !== "heatmap" &&
            type !== "distributiveflowmap" &&
            type !== "pointmap" &&
            type !== "3drectangle" &&
            type !== "chroplethmap"
        ) {
            return res.status(400).json({
                errorMessage: "Invalid map type.",
            })
        }

        // const userMapWithTitle = await MapMetadata.countDocuments({
        //     title: title,
        //     user: res.locals.userId,
        // })
        // if (userMapWithTitle > 0) {
        //     return res.status(400).json({
        //         errorMessage: "Map with title already exists.",
        //     })
        // }

        const newGeoJsonSchema = new GeoJsonSchema({
            geoBuf: buffer,
        })
        const savedGeoJsonSchema = await newGeoJsonSchema.save()
        if (!savedGeoJsonSchema) {
            return res.status(500).end()
        }

        // TODO: (later) fieldData to be implement

        const newMap = new MapMetadata({
            title: title,
            user: res.locals.userId,
            mapType: type,
            // TODO: (later)
            // Generate thumbnail here?
            geojsonId: savedGeoJsonSchema._id,
            fieldDataId: savedGeoJsonSchema._id,
            // Create fieldData object
        })

        const saved = await newMap.save()
        if (!saved) {
            return res.status(500).end()
        }

        return res.status(200).json({ id: saved._id })
    } catch (err) {
        console.error("mapapi-controller::createNewMap")
        console.error(err)
        return res.status(500).end()
    }
}

createDuplicateMapById = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).end()
        }

        const srcMap = Map.findById(id)
        if (!srcMap) {
            return res.status(404).end()
        }
        if (srcMap.user.toString() !== res.locals.userId) {
            return res.status(401).end()
        }

        // TODO: (collaborate) deal with collabotor permissions later

        var newMapTitle
        for (let i = 1; i < 9999; i++) {
            // hard-cap... our app will probably break before this much attempts.
            newMapTitle = `${srcMap.title} (${i})`
            let mapExist = await Map.find({
                title: newMapTitle,
                user: res.locals.userId,
            })
            if (!mapExist) {
                break
            }
        }

        // TODO: (later) Current both maps point towards the same GeoJsonSchema and fielddata, to be implemented after fielddata is implemented.
        delete srcMap._id
        srcMap.title = newMapTitle
        srcMap.commentsId = []
        srcMap.like = []
        srcMap.dislike = []

        const newMap = new Map(srcMap)
        const saved = await newMap.save()

        if (!saved) {
            return res.status(500).end()
        }
        return res.status(200).end()
    } catch (err) {
        console.error("mapapi-controller::createDuplicatedMapById")
        console.error(err)
        return res.status(500).end()
    }
}

createForkMapById = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).end()
        }

        const srcMap = Map.findById(id)
        if (!srcMap) {
            return res.status(404).end()
        }
        if (!srcMap.published) {
            return res.status(401).end()
        }

        var newMapTitle
        for (let i = 1; i < 9999; i++) {
            // hard-cap... our app will probably break before this much attempts.
            newMapTitle = `${srcMap.title} (${i})`
            let mapExist = await Map.find({
                title: newMapTitle,
                user: res.locals.userId,
            })
            if (!mapExist) {
                break
            }
        }

        // TODO: (later) Current both maps point towards the same GeoJsonSchema and fielddata, to be implemented after fielddata is implemented.
        srcMap.parentMapId = srcMap._id
        delete srcMap._id
        srcMap.title = newMapTitle
        srcMap.user = res.locals.userId
        srcMap.commentsId = []
        srcMap.like = []
        srcMap.dislike = []

        const newMap = new Map(srcMap)
        const saved = await newMap.save()

        if (!saved) {
            return res.status(500).end()
        }
        return res.status(200).end()
    } catch (err) {
        console.error("mapapi-controller::createForkMapById")
        console.error(err)
        return res.status(500).end()
    }
}

deleteMapById = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return res.status(400).end()
        }

        const toBeDeleted = await MapMetadata.findById(id)
        if (!toBeDeleted) {
            return res.status(404).end()
        }
        if (toBeDeleted.user.toString() !== res.locals.userId) {
            return res.status(401).end()
        }

        const deleted = await MapMetadata.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(500).end()
        }
        // TODO: delete associated values as well

        return res.status(200).end()
    } catch (err) {
        console.error("mapapi-controller::deleteMapById")
        console.error(err)
        return res.status(500).end()
    }
}

updateMapNameById = async (req, res) => {
    try {
        const id = req.params.id
        const title = req.body.name

        if (!id || !title) {
            return res.status(400).end()
        }

        const toBeUpdated = await MapMetadata.findById(id)
        if (!toBeUpdated) {
            return res.status(404).end()
        }
        if (toBeUpdated.user.toString() !== res.locals.userId) {
            return res.status(401).end()
        }

        // TODO: (later) see if the title is already used for this user.
        // Make sure the following works
        const updated = await MapMetadata.findByIdAndUpdate(id, {
            title: title,
        })

        if (!updated) {
            return res.status(500).end()
        }
        return res.status(200).end()
    } catch (err) {
        console.error("mapapi-controller::updateMapNameByID")
        console.error(err)
        return res.status(500).end()
    }
}

updateMapPublishStatus = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return res.status(400).end()
        }

        const toBeUpdated = await MapMetadata.findById(id)
        if (!toBeUpdated) {
            return res.status(404).end()
        }
        if (toBeUpdated.user.toString() !== res.locals.userId) {
            return res.status(401).end()
        }

        const updated = await MapMetadata.findByIdAndUpdate(id, {
            published: true,
        })

        if (!updated) {
            return res.status(500).end()
        }
        return res.status(200).end()
    } catch (err) {
        console.error("mapapi-controller::updateMapPublishStatus")
        console.error(err)
        return res.status(500).end()
    }
}

// Rest of the update functions to be written later.

// like dislikes and comment to be written here.

module.exports = {
    getMapById,
    getUserMaps,
    getAllPublishedMaps,
    getGeoJsonById,
    getMapFieldsById,
    createNewMap,
    createDuplicateMapById,
    createForkMapById,
    deleteMapById,
    updateMapNameById,
    // updateMapTag,
    updateMapPublishStatus,
    // updateMapJson,
}
