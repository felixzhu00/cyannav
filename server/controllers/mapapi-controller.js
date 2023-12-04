const MapMetadata = require("../schemas/Map/mapMetadataSchema")
const GeoJsonSchema = require("../schemas/Map/geoJsonSchema")
const MapFields = require("../schemas/Map/fieldDataSchema")
const Comment = require("../schemas/Map/commentSchema")

const mongoose = require("mongoose")
var ObjectId = mongoose.Types.ObjectId

getMapById = async (req, res) => {
    try {
        const { id } = req.body

        if (!id || !ObjectId.isValid(id)) {
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
        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).end()
        }

        var userMaps
        if (res.locals.userId === id) {
            // get all my maps
            userMaps = await MapMetadata.find({ user: id }).populate(
                "user",
                "username -_id"
            )
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
        const publishedMaps = await MapMetadata.find({
            published: true,
        }).populate("user", "username -_id")
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
        const id = req.params.id

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).end()
        }

        const geojson = await GeoJsonSchema.findById(id)

        if (!geojson) {
            return res.status(404).end()
        }

        console.log(geojson.geoBuf)
        return res.status(200).json({
            geoBuf: geojson.geoBuf, // TODO: (later) figure out geobuf
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

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).end()
        }

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
        if (!title || !type || !GeoJsonSchemabuf) {
            return res.status(400).json({
                errorMessage: "Invalid request.",
            })
        }

        let bufferArray = Object.values(GeoJsonSchemabuf)
        let buffer = Buffer.from(bufferArray)

        if (
            type !== "heatmap" &&
            type !== "distributiveflowmap" &&
            type !== "pointmap" &&
            type !== "3drectangle" &&
            type !== "choroplethmap"
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
        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).end()
        }

        const srcMap = await MapMetadata.findById(id)
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
            let mapExist = await MapMetadata.countDocuments({
                title: newMapTitle,
                user: res.locals.userId,
            })
            if (mapExist == 0) {
                break
            }
        }

        // TODO: (later) Current both maps point towards the same GeoJsonSchema and fielddata, to be implemented after fielddata is implemented.
        let x = srcMap.toObject()
        delete x._id
        x.title = newMapTitle
        x.commentsId = []
        x.like = []
        x.dislike = []
        x.published = false

        const newMap = new MapMetadata(x)
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

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).end()
        }

        const srcMap = MapMetadata.findById(id)
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
            let mapExist = await MapMetadata.find({
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

        const newMap = new MapMetadata(srcMap)
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
        if (!id || !ObjectId.isValid(id)) {
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
        const { id, title } = req.body
        console.log(id)
        console.log(title)
        if (!id || !ObjectId.isValid(id) || !title) {
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
        const { id } = req.body
        console.log(id)

        if (!id || !ObjectId.isValid(id)) {
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
likeMap = async (req, res) => {
    try {
        const { id } = req.body
        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).end()
        }

        const targetMap = await MapMetadata.findById(id)
        if (!targetMap) {
            return res.status(404).end()
        }

        const userObjectId = new ObjectId(res.locals.userId)
        console.log(userObjectId)
        // Remove existing dislike

        const dislikeIndex = targetMap.dislike.indexOf(userObjectId)

        if (dislikeIndex > -1) {
            targetMap.dislike.splice(dislikeIndex, 1)
        }

        const likeIndex = targetMap.like.indexOf(userObjectId)

        if (likeIndex > -1) {
            console.log("2")

            // Already liked, so remove like.
            targetMap.like.splice(likeIndex, 1)
        } else {
            console.log("3")

            // Add like to list
            targetMap.like.push(userObjectId)
        }

        const saved = await targetMap.save()
        if (!saved) {
            return res.status(500).end()
        }

        console.log("SUCCESS")
        return res.status(200).end()
    } catch (err) {
        console.error("mapapi-controller::likeMap")
        console.error(err)
        return res.status(500).end()
    }
}

dislikeMap = async (req, res) => {
    try {
        const { id } = req.body

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).end()
        }

        const targetMap = await MapMetadata.findById(id)
        if (!targetMap) {
            return res.status(404).end()
        }

        const userObjectId = new ObjectId(res.locals.userId)

        // Remove existing dislike
        const dislikeIndex = targetMap.dislike.indexOf(userObjectId)
        if (dislikeIndex > -1) {
            // Already disliked, remove dislike
            targetMap.dislike.splice(dislikeIndex, 1)
        } else {
            // Add dislike to list
            targetMap.dislike.push(userObjectId)
        }

        const likeIndex = targetMap.like.indexOf(userObjectId)
        if (likeIndex > -1) {
            // Remove existing like if exist.
            targetMap.like.splice(likeIndex, 1)
        }

        const saved = await targetMap.save()
        if (!saved) {
            return res.status(500).end()
        }

        return res.status(200)
    } catch (err) {
        console.error("mapapi-controller::dislikeMap")
        console.error(err)
        return res.status(500).end()
    }
}

postComment = async (req, res) => {
    try {
        const { text, parentCommentId, mapId } = req.body

        if (
            !text ||
            !mapId ||
            !ObjectId.isValid(mapId) ||
            !ObjectId.isValid(parentCommentId)
        ) {
            return res.status(400).end()
        }

        var parentComment = undefined
        var map = undefined
        if (!parentCommentId) {
            parentComment = await Comment.findById(parentCommentId)
            if (!parentComment) {
                return res.status(404).end()
            }
        } else {
            // Root map,
            map = await MapMetadata.findById(mapId)
            if (!map) {
                return res.status(404).end()
            }
            if (!map.published) {
                return res.status(401).end()
            }
        }

        const newComment = new Comment({
            author: res.locals.userId,
            text: text,
        })

        const saved = await newComment.save()
        if (!saved) {
            return res.status(500).end()
        }

        if (parentComment != undefined) {
            parentComment.childComments = [
                ...parentComment.childComments,
                saved._id,
            ]
            const pSaved = await parentComment.save()
            if (!pSaved) {
                return res.status(500).end()
            }
        } else {
            // This is root comment.
            map.commentsId = [...map.commentsId, saved._id]
            const mSaved = await map.save()
            if (!mSaved) {
                return res.status(500).end()
            }
        }

        return res.status(200).end()
    } catch (err) {
        console.error("mapapi-controller::postComment")
        console.error(err)
        return res.status(500).end()
    }
}

getCommentById = async (req, res) => {
    try {
        const { id } = req.body

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).end()
        }

        const targetComment = await Comment.findById(id)
        if (!targetComment) {
            return res.status(404).end()
        }

        return res.status(200).json({
            author: targetComment.author,
            childComments: targetComment.childComments,
            upvotes: targetComment.upvotes,
            downvotes: targetComment.downvotes,
            ask_date: targetComment.ask_date,
            text: targetComment.text,
        })
    } catch (err) {
        console.error("mapapi-controller::getCommentById")
        console.error(err)
        return res.status(500).end()
    }
}

updateMapTag = async (req, res) => {
    try {
        const { id, newTags } = req.body
        if (!id || !ObjectId.isValid(id) || !newTags) {
            return res.status(400).end()
        }

        var targetMap = await MapMetadata.findById(id)
        if (!targetMap) {
            return res.status(404).end()
        }

        targetMap.tags = newTags
        const saved = await targetMap.save()
        if (!saved) {
            console.log("rest")
            return res.status(500).end()
        }
        return res.status(200).end()
    } catch (err) {
        console.error("mapapi-controller::updateMapTag")
        console.error(err)
        return res.status(500).end()
    }
}

updateMapGeoJson = async (req, res) => {
    try {
        // Id refers to map id
        const { id, geoBuf } = req.body

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).end()
        }

        targetMap = MapMetadata.findById(id)
        if (!targetMap) {
            return res.status(404).end()
        }

        if (targetMap.userId.toString() !== res.locals.userId) {
            return res.status(401).end()
        }

        targetGeoJson = GeoJsonSchema.findById(targetMap.geojsonId)
        if (!targetGeoJson) {
            return res.status(404).end()
        }

        targetGeoJson.geoBuf = geoBuf

        const saved = await targetGeoJson.save()
        if (!saved) {
            return res.status(500).end()
        }

        return res.status(200).end()
    } catch (err) {
        console.error("mapapi-controller::updateMapGeoJson")
        console.error(err)
        return res.status(500).end()
    }
}

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
    updateMapTag,
    updateMapPublishStatus,
    updateMapGeoJson,
    postComment,
    getCommentById,
    likeMap,
    dislikeMap,
}
