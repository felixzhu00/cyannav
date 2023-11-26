const MapMetadata = require("../schemas/Map/mapMetadataSchema")
const GeoJSON = require("../schemas/Map/geoJsonSchema")
const MapFields = require("../schemas/Map/fieldDataSchema")

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

        if (!targetMap.published && targetMap.user !== res.locals.userId) {
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
        const { id } = req.body

        if (!id) {
            return res.status(400).end()
        }

        var userMaps
        if (res.locals.userId === userId) {
            userMaps = await MapMetadata.find({ user: id })
        } else {
            userMaps = await MapMetadata.find({
                user: userId,
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

        const geoJson = await GeoJSON.findById(id)

        if (!geoJson) {
            return res.status(404).end()
        }

        return res.status(200).json({
            geoBuf: geoJson.buf, // TODO: (later) figure out geobuf
        })
    } catch (err) {
        console.error("mapapi-controller::getGeoJsonById")
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
        const { title, type, geojsonbuf } = req.body

        if (!title || !type || !geojson) {
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

        const userMapWithTitle = await MapMetadata.countDocuments({
            title: title,
            user: res.locals.userId,
        })
        if (userMapWithTitle > 0) {
            return res.status(400).json({
                errorMessage: "Map with title already exists.",
            })
        }

        const newGeoJson = new GeoJSON({
            geoBuf: geojsonbuf,
        })
        const savedGeoJson = await newGeoJson.save()
        if (!savedGeoJson) {
            return res.status(500).end()
        }

        // TODO: (later) fieldData to be implement

        const newMap = new MapMetadata({
            title: title,
            user: res.locals.userId,
            mapType: type,
            // TODO: (later)
            // Generate thumbnail here?
            geojsonId: savedGeoJson._id,
            fieldDataId: savedGeoJson._id,
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
        if (srcMap.user !== res.locals.userId) {
            return res.status(401).end()
        }

        // TODO: (collaborate) deal with collabotor permissions later

        var newMapTitle
        for (let i = 0; i < 9999; i++) {
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

        // TODO: (later) Current both maps point towards the same geojson and fielddata, to be implemented after fielddata is implemented.
        delete srcMap._id
        srcMap.title = newMapTitle

        const newMap = new Map(srcMap)
        const saved = await newMap.save()

        if (!saved) {
            return res.status(500).end()
        }
    } catch (err) {
        console.error("mapapi-controller::createDuplicatedMapById")
        console.error(err)
        return res.status(500).end()
    }
}

createForkMapById = async (req, res) => {
    // TODO: (later)basically duplicated, but with different user
    // Need to add parent in database as well.
    return
}

deleteMapById = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).end()
        }

        const toBeDeleted = await MapMetadata.findById(id)
        if (!toBeDeleted) {
            return res.status(404).end()
        }
        if (toBeDeleted.user !== res.locals.userId) {
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
        const { id, title } = req.body

        if (!id || !title) {
            return res.status(400).end()
        }

        const toBeUpdated = await MapMetadata.findById(id)
        if (!toBeUpdated) {
            return res.status(404).end()
        }
        if (toBeUpdated.user !== res.locals.userId) {
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

// Rest of the update functions to be written later.

// like dislikes and comment to be written here.
