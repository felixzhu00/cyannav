const Map = require("../schemas/mapGraphicSchema")

getMapById = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).end()
        }

        const targetMap = await Map.findOne({ _id: id })
        if (!targetMap) {
            // TODO: (later) figure out if this is the correct status code.
            return res.status(400).end()
        }

        // The user have no access to this map.
        // TODO: (collaborate) when we implement collabortors, we need the permission here
        if (!targetMap.published && targetMap.user !== res.locals.userId) {
            return res.status(401).end()
        }

        return res.status(200).json({
            map: targetMap, // TODO: (later) for now I'm returning everything.
        })
    } catch (err) {
        console.error("api-controller::getMapById")
        console.error(err)

        return res.status(500).end()
    }
}

getUserMaps = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({
                errorMessage: "Improper request",
            })
        }

        var userMaps // TODO: (later) need testing
        if (res.locals.userId === userId) {
            userMaps = await Map.find({ user: userId })
        } else {
            // Only get the maps that are published TODO: (collaborate) gets maps user have permission for.
            userMaps = await Map.find({ user: userId, published: true })
        }

        return res.status(200).json({
            maps: userMaps, // TODO: (later) for now I'm returning everything.
        })
    } catch (err) {
        console.error("api-controller::getUserMaps")
        console.error(err)

        return res.status(500).end()
    }
}

getAllMaps = async (req, res) => {
    try {
        // const allmaps = await Map.find({ published: true })
        // const allMaps = await Map.find()

        return res.status(200).json({
            // maps: allMaps, // TODO: (later) for now I'm returning everything.
        })
    } catch (err) {
        console.error("api-controller::getAllMaps")
        console.error(err)

        return res.status(500).end()
    }
}

getMapJsonById = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).end()
        }

        const targetMap = await Map.findOne({ _id: id })
        if (!targetMap) {
            // TODO: figure out if this is the correct status code.
            return res.status(404).end()
        }

        if (targetMap.user !== res.locals.userId && !targetMap.published) {
            return res.status(401).end()
        }

        return res.status(200).json({
            mapJSON: targetMap.navjson, // TODO: (later) save geojson as obj?
        })
    } catch (err) {
        console.error("api-controller::getMapJsonById")
        console.error(err)

        return res.status(500).end()
    }
}

createNewMap = async (req, res) => {
    try {
        // TODO: (later) how do we handle guest? Do we create one without a user??.

        const { title, type, json } = req.body

        if (!title || !type || !json) {
            return res.status(400).end()
        }
        if (type !== "heatmap") {
            // TODO: (later) AND MORE, add all possible values here.
            return res.status(400).end()
        }
        // Seems kind of inefficient but oh well.
        const userMapWithTitle = await Map.countDocuments({
            title: title,
            user: res.locals.userId,
        })
        if (userMapWithTitle > 0) {
            return res.status(401).end()
        }

        const newMap = new Map({
            mapType: type,
            navjson: json,
            title: title,
        })

        const saved = await newMap.save()
        if (!saved) {
            return res.status(500).end()
        }

        return res.status(200).json({ id: saved._id })
    } catch (err) {
        console.error("api-controller::createNewMap")
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
            return res.status(400).end()
        }

        if (srcMap.user !== res.locals.userId) {
            return res.status(401).end()
        }

        // TODO: (collaborate) add collaborator permission
        // Actually, figure out if a collaborate should fork or create

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

        // TODO: (later) This probably doesn't work, as it stores our JSON as id, and they are now point
        // to the same id. We'll fix this after we clarify the data model
        delete srcMap._id
        srcMap.title = newMapTitle

        const newMap = new Map(srcMap)
        const saved = await newMap.save()

        if (!saved) {
            return res.status(500).end()
        }

        return res.status(200).json({ id: saved._id })
    } catch (err) {
        console.error("api-controller::createDuplicateMapById")
        console.error(err)

        return res.status(500).end()
    }
}

createForkMapById = async (req, res) => {
    try {
        // TODO: (later) basically the same as duplicate.
        // will implment later when we have concrete data structure.
        return res.status(404).end()
    } catch (err) {
        console.error("api-controller::createForkMapById")
        console.error(err)

        return res.status(500).end()
    }
}

deleteMapById = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).end()
        }

        const toBeDeleted = await Map.findById(id)
        if (toBeDeleted.user !== res.locals.userId) {
            return res.status(401).end()
        }

        const deleted = await Map.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(500).end()
        }

        return res.status(200).end()
    } catch (err) {
        console.error("api-controller::deleteMapById")
        console.error(err)

        return res.status(500).end()
    }
}
updateMapNameById = async (req, res) => {
    try {
    } catch (err) {
        console.error("api-controller::updateMapNameById")
        console.error(err)
    }
}
updateMapTag = async (req, res) => {
    try {
    } catch (err) {
        console.error("api-controller::updateMapTag")
        console.error(err)
    }
}
updateMapPublishStatus = async (req, res) => {
    try {
    } catch (err) {
        console.error("api-controller::updateMapPublishStatus")
        console.error(err)
    }
}
updateMapJson = async (req, res) => {
    try {
    } catch (err) {
        console.error("api-controller::updateMapJson")
        console.error(err)
    }
}

module.exports = {
    getMapById,
    getUserMaps,
    getAllMaps,
    getMapJsonById,
    createNewMap,
    createDuplicateMapById,
    createForkMapById,
    deleteMapById,
    updateMapNameById,
    updateMapTag,
    updateMapPublishStatus,
    updateMapJson,
}
