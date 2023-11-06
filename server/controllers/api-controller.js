const Map = require('../schemas/mapGraphicSchema')


getMapById = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).json({
                errorMessage: "Improper request"
            })
        }

        const targetMap = await Map.findOne({_id: id})

        if (!targetMap) {
            // TODO: figure out if this is the correct status code.
            return res.status(404).json({
                errorMessage: "No map by ID"
            })
        }
        
        return res.status(200).json({
            // TODO: how to format data here.. 
        })
    } catch (err) {
        // TODO: error handling
        console.log("getMapById:: " + err)
    }
}

getUserMaps = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({
                errorMessage: "Improper request"
            })
        }

        // TODO: test this.
        const Maps = await Map.find({user: userId})

        return res.status(200).json({
            // TODO: how to format data here..
        })
    } catch (err) {
        // TODO: error handling
        console.log("getUserMaps:: " + err)
    }
}

getAllMaps = async (req, res) => {
    try {
        const Maps = await Map.find()

        // Not including 400 bad request because there is 
        // literally nothing to be formatted wrong

        return res.status(200).json({
            // TODO: how to format data here..
        })
    } catch (err) {
        // TODO: error handling
        console.log("getUserMaps:: " + err)
    }
}

getMapJsonById = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).json({
                errorMessage: "Improper request"
            })
        }

        const targetMap = await Map.findOne({_id: id})

        if (!targetMap) {
            // TODO: figure out if this is the correct status code.
            return res.status(404).json({
                errorMessage: "No map by ID"
            })
        }
        
        return res.status(200).json({
            // TODO: how to format data here.. 
            // This should be targetMap.navJSON
        })
    } catch (err) {
        // TODO: error handling
        console.log("getMapById:: " + err)
    }
}

createNewMap = async (req, res) => {
    const { type } = req.body //used to be const { type, template, json } = req.body
                                            //no clue what template is, replacing it for now so that
                                            //we can do our backend tests with jest

    if (!type) {
        return res.status(400).json({
            errorMessage: "Improper request"
        })
    }

    return res.status(201).json({
        // TODO: deal with later, also, why 201?
    })
}

createDuplicateMapById = async (req, res) => {}
createForkMapById = async (req, res) => {}
deleteMapById = async (req, res) => {}
updateMapNameById = async (req, res) => {}
updateMapTag = async (req, res) => {}
updateMapPublishStatus = async (req, res) => {}
updateMapJson = async (req, res) => {}

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
    updateMapJson
}