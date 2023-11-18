const Map = require("../schemas/mapGraphicSchema")

getMapById = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400)
        }

        const targetMap = await Map.findOne({ _id: id })
        if (!targetMap) {
            // TODO: (later) figure out if this is the correct status code.
            return res.status(404)
        }

        // The user have no access to this map.
        // TODO: (collaborate) when we implement collabortors, we need the permission here
        if (!targetMap.published && targetMap.user !== res.locals.userId) {
            return res.status(401)
        }

        return res.status(200).json({
            map: targetMap, // TODO: (later) for now I'm returning everything.
        })
    } catch (err) {
        console.error("api-controller::getMapById")
        console.error(err)

        return res.status(500)
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

        return res.status(500)
    }
}

getAllMaps = async (req, res) => {
    try {
        // const allmaps = await Map.find({ published: true })
        const allMaps = await Map.find()

        return res.status(200).json({
            maps: allMaps, // TODO: (later) for now I'm returning everything.
        })
    } catch (err) {
        console.error("api-controller::getAllMaps")
        console.error(err)

        return res.status(500)
    }
}

getMapJsonById = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400)
        }

        const targetMap = await Map.findOne({ _id: id })
        if (!targetMap) {
            // TODO: figure out if this is the correct status code.
            return res.status(404)
        }

        if (targetMap.user !== res.locals.userId && !targetMap.published) {
            return res.status(401)
        }

        return res.status(200).json({
            mapJSON: targetMap.navjson, // TODO: (later) save geojson as obj?
        })
    } catch (err) {
        console.error("api-controller::getMapJsonById")
        console.error(err)

        return res.status(500)
    }
}

createNewMap = async (req, res) => {
    try {
        // TODO: complete this method.
        const {} = req.body

        return res.status(200).json({})
    } catch (err) {
        console.error("api-controller::createNewMap")
        console.error(err)
    }
}

createDuplicateMapById = async (req, res) => {
    try {
    } catch (err) {
        console.error("api-controller::createDuplicateMapById")
        console.error(err)
    }
}

createForkMapById = async (req, res) => {
    try {
    } catch (err) {
        console.error("api-controller::createForkMapById")
        console.error(err)
    }
}
deleteMapById = async (req, res) => {
    try {
    } catch (err) {
        console.error("api-controller::deleteMapById")
        console.error(err)
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
