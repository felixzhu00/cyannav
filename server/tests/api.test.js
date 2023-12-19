// Environmental vairables for testing.

//all tests temporarily moved to this file. will move them back in build 5
process.env.SERVER_PORT = undefined
process.env.SERVER_ADDRESS = "localhost"
process.env.JWT_SECRET = "testing"

const fs = require("fs")
const path = require("path")
const geobuf = require("geobuf")
const Pbf = require("pbf")
const app = require("../index.js")
const request = require("supertest")
const filePath = path.join(__dirname, "testMap.geojson")
const testMap = JSON.parse(fs.readFileSync(filePath, "utf8"))
const buffer = geobuf.encode(testMap, new Pbf())

const {
    getMapById,
    getUserMaps,
    getAllPublishedMaps,
    getGeoJsonById,
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
    likeComment,
    dislikeComment,
} = require("../controllers/mapapi-controller.js")

const MapMetaData = require("../schemas/Map/mapMetadataSchema")
const GeoJsonSchema = require("../schemas/Map/geoJsonSchema")
const commentSchema = require("../schemas/Map/commentSchema")

jest.mock('../schemas/Map/mapMetadataSchema');
jest.mock('../schemas/Map/geoJsonSchema');
jest.mock('../schemas/Map/commentSchema');

afterEach(() => {
    jest.clearAllMocks()
})

/* Map API Tests*/
describe("getMapById function", () => {
    it("correctly returns a map", async () => {
        MapMetaData.findOne = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        const req = { params: { id: 1 } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await getMapById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            metadata: {
                _id: 1,
                title: "test",
                user: "rob",
                mapType: "pointmap",
                published: true,
                geojsonId: buffer,
            },
        })
    })
    it("no target map in the db", async () => {
        MapMetaData.findOne = jest.fn().mockResolvedValueOnce(false)
        const req = { params: { id: 1 } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await getMapById(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
    })
    it("tests not published, not owned maps", async () => {
        MapMetaData.findOne = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: false,
            geojsonId: buffer,
        })
        const req = { params: { id: 1 } }
        const res = {
            locals: {
                userId: 0
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await getMapById(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
    })
})

describe("getUserMaps function", () => {
    it("correctly returns a user's map", async () => {
        MapMetaData.find = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        const req = {
            params: {
                id: 1,
            },
        }
        const res = {
            locals: {
                userId: 2,
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await getUserMaps(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            userMaps: {
                _id: 1,
                title: "test",
                user: "rob",
                mapType: "pointmap",
                published: true,
                geojsonId: buffer,
            },
        })
    })
})

describe("getAllPublishedMaps function", () => {
    it("correctly published maps", async () => {
        MapMetaData.find = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockResolvedValueOnce([
                {
                    _id: 1,
                    title: "test",
                    user: "rob",
                    mapType: "pointmap",
                    published: true,
                    geojsonId: buffer,
                },
            ]),
        })
        const req = {}
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await getAllPublishedMaps(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    })
})

describe("getGeoJsonById function", () => {
    it("returns 404 if no mapmetadata is found in db", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce(false)
        const req = {
            params: {
                id: 1,
            },
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await getGeoJsonById(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
    })
    it("returns 404 if no geojsonschema is found in db", async () => {
        GeoJsonSchema.findById = jest.fn().mockResolvedValueOnce(false)
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        const req = {
            params: {
                id: 1,
            },
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await getGeoJsonById(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
    })
    
    it("correctly returns a geojson", async () => {
        GeoJsonSchema.findById = jest.fn().mockResolvedValueOnce({
            geoBuf: buffer,
        })
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        const req = {
            params: {
                id: 1,
            },
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await getGeoJsonById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            geoBuf: buffer,
        })
    })
})

describe("createNewMap function", () => {
    it("returns 400 if a user's map with this title already exists", async () => {
        MapMetaData.countDocuments = jest.fn().mockResolvedValueOnce(1)

        const req = { 
            body: {
                title: "title",
                type: "heatmap",
                GeoJsonSchemabuf: testMap,
                tags: []
            }}

        const res = {
            locals:{
                userId: 0
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await createNewMap(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            errorMessage: "Map with title already exists."
        })
    })
    it("returns 500 if geojson schema does not save", async () => {
        MapMetaData.countDocuments = jest.fn().mockResolvedValueOnce(0)
        const mockGeoJsonSchemaInstance = {
            geoBuf: buffer,
            save: jest.fn().mockResolvedValueOnce(false),
          };
        GeoJsonSchema.mockImplementationOnce(() => mockGeoJsonSchemaInstance);

        const req = { 
            body: {
                title: "title",
                type: "heatmap",
                GeoJsonSchemabuf: buffer,
                tags: []
            }}

        const res = {
            locals: {
                userId: 0
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await createNewMap(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("returns 500 if mapmetadata schema does not save", async () => {
        MapMetaData.countDocuments = jest.fn().mockResolvedValueOnce(0)
        const mockGeoJsonSchemaInstance = {
            geoBuf: buffer,
            save: jest.fn().mockResolvedValueOnce(buffer),
          };
        GeoJsonSchema.mockImplementationOnce(() => mockGeoJsonSchemaInstance);
        const mockMapMetaDataSchemaInstance = {
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
            save: jest.fn().mockResolvedValueOnce(false),
          };
        MapMetaData.mockImplementationOnce(() => mockMapMetaDataSchemaInstance);
        const req = { 
            body: {
                title: "title",
                type: "heatmap",
                GeoJsonSchemabuf: buffer,
                tags: []
            }}

        const res = {
            locals: {
                userId: 0
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await createNewMap(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("returns 200 if everything works", async () => {
        MapMetaData.countDocuments = jest.fn().mockResolvedValueOnce(0)
        const mockGeoJsonSchemaInstance = {
            geoBuf: buffer,
            save: jest.fn().mockResolvedValueOnce(buffer),
          };
        GeoJsonSchema.mockImplementationOnce(() => mockGeoJsonSchemaInstance);
        const mockMapMetaDataSchemaInstance = {
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
            save: jest.fn().mockResolvedValueOnce(
                {
                    _id: 1,
                    title: "test",
                    user: "rob",
                    mapType: "pointmap",
                    published: true,
                    geojsonId: buffer
                }),
          };
        MapMetaData.mockImplementationOnce(() => mockMapMetaDataSchemaInstance);
        const req = { 
            body: {
                title: "title",
                type: "heatmap",
                GeoJsonSchemabuf: buffer,
                tags: []
            }}

        const res = {
            locals: {
                userId: 0
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await createNewMap(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({id: 1})

    })
})

describe("createDuplicateMap function", () => {
    it("srcMap user does not match current user", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce(
            {
                _id: 1,
                title: 'test',
                user: "rob",
                mapType: 'pointmap',
                published: true,
                geojsonId: buffer,
            }
        )
        const req = {body: { id: 1 }}
        const res = {
            locals: {
                userId: "robbie"
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        };
        await createDuplicateMapById(req, res)

        expect(res.status).toHaveBeenCalledWith(401);
    })
    it("srcMap is not found", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce(false)
        
        const req = {body: { id: 1 }}
        const res = {
            locals: {
                userId: "robbie"
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        };
        await createDuplicateMapById(req, res)

        expect(res.status).toHaveBeenCalledWith(404);
    })
})

describe("createForkMap function", () => {
    it("srcMap is not published", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce(
            {
                _id: 1,
                title: 'test',
                user: "rob",
                mapType: 'pointmap',
                published: false,
                geojsonId: buffer,
            }
        )
        const req = {body: { id: 1 }}
        const res = {
            locals: {
                userId: "robbie"
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        };
        await createForkMapById(req, res)

        expect(res.status).toHaveBeenCalledWith(401);
    })
})

describe("deleteMapById function", () => {
    it("returns 401 if no mapmetadata match", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "robbie",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        const req = { params: { id: 1 } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await deleteMapById(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
    })
    it("returns 500 if there was an error during deletion", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        MapMetaData.findByIdAndDelete = jest.fn().mockResolvedValueOnce(false)
        const req = { params: { id: 1 } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await deleteMapById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("correctly deletes a map", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        MapMetaData.findByIdAndDelete = jest.fn().mockResolvedValueOnce(true)
        commentSchema.deleteMany = jest.fn().mockResolvedValueOnce(true)
        GeoJsonSchema.findByIdAndDelete = jest.fn().mockResolvedValueOnce(true)
        const req = { params: { id: 1 } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await deleteMapById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    })
})

describe("updateMapNameById function", () => {
    it("returns 401 if mapmetadata name does not match user", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "robbie",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        const req = { body: { id: 1, title: "hello" } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateMapNameById(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
    })
    it("returns 400 if user has a map with the same name already", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        MapMetaData.countDocuments = jest.fn().mockResolvedValueOnce(1)
        const req = { body: { id: 1, title: "hello" } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateMapNameById(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            errorMessage: "Map with title already exists."
        })
    })
    it("returns 500 if error when updating map", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        MapMetaData.countDocuments = jest.fn().mockResolvedValueOnce(0)
        MapMetaData.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(false)
        const req = { body: { id: 1, title: "hello" } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateMapNameById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("returns 200 if correctly updated map", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        MapMetaData.countDocuments = jest.fn().mockResolvedValueOnce(0)
        MapMetaData.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(true)
        const req = { body: { id: 1, title: "hello" } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateMapNameById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    })
})

describe("updateMapPublishStatus function", () => {
    it("returns 401 if user does not match currrent user", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "robbie",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        const req = { body: { id: 1 } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateMapPublishStatus(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
    })
    it("returns 500 if error when updating map", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        MapMetaData.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(false)
        const req = { body: { id: 1 } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateMapPublishStatus(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("correctly updates a map publish status", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        MapMetaData.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(true)
        const req = { body: { id: 1 } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateMapPublishStatus(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    })
})

describe("likeComment function", () => {
    it("returns 404 if comment is not in db", async () => {
        commentSchema.findById = jest.fn().mockResolvedValueOnce(false)
        const req = { body: { id: 1 } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await likeComment(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
    })
})

describe("dislikeComment function", () => {
    it("returns 404 if comment is not in db", async () => {
        commentSchema.findById = jest.fn().mockResolvedValueOnce(false)
        const req = { body: { id: 1 } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await dislikeComment(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
    })
})

describe("likeMap function", () => {
    it("returns 404 if comment is not in db", async () => {
        commentSchema.findById = jest.fn().mockResolvedValueOnce(false)
        const req = { body: { id: 1 } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await likeMap(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
    })
})

describe("dislikeMap function", () => {
    it("returns 404 if comment is not in db", async () => {
        commentSchema.findById = jest.fn().mockResolvedValueOnce(false)
        const req = { body: { id: 1 } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await dislikeMap(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
    })
})

// describe("postComment function", () => {
//     it("correctly updates a mapname", async () => {
//         commentSchema.findById = jest.fn().mockResolvedValueOnce({
//             _id: 1,
//             title: "test",
//             user: "rob",
//             mapType: "pointmap",
//             published: true,
//             geojsonId: buffer,
//         })
//         MapMetaData.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(true)
//         const req = { body: { id: 1, title: "hello" } }
//         const res = {
//             locals: {
//                 userId: "rob",
//             },
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn(),
//             end: jest.fn(),
//         }
//         await updateMapNameById(req, res)

//         expect(res.status).toHaveBeenCalledWith(200)
//     })
// })

describe("getCommentById function", () => {
    it("returns 404 if target comment does not exist", async () => {
        commentSchema.findById = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockResolvedValueOnce(
                false
            ),
        })
        const req = { body: { id: 1 } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await getCommentById(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
    })
})

describe("updateMapTag function", () => {
    it("returns 404 if map doesnt exist", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce(false)
        const req = { body: { id: "5f5b96b61c77a3a07c947720", newTags: [] } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateMapTag(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
    })
    it("return 500 if map cannot save", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        const mockMapMetaDataInstance = {
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
            save: jest.fn().mockResolvedValueOnce(false),
          };
        MapMetaData.mockImplementationOnce(() => mockMapMetaDataInstance);
        const req = { body: { id: 1, newTags: [] } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateMapTag(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("return 200 if map updated tags successfully", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
            save: jest.fn().mockResolvedValueOnce(true),
        })
        const mockMapMetaDataInstance = {
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
            save: jest.fn().mockResolvedValueOnce(true),
          };
        MapMetaData.mockImplementationOnce(() => mockMapMetaDataInstance);
        const req = { body: { id: 1, newTags: []} }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateMapTag(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    })
})

describe("updateMapGeoJson function", () => {
    it("correctly updates a map publish status", async () => {
        MapMetaData.findById = jest.fn().mockResolvedValueOnce({
            _id: 1,
            title: "test",
            user: "rob",
            mapType: "pointmap",
            published: true,
            geojsonId: buffer,
        })
        MapMetaData.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(true)
        const req = { body: { id: 1, geoBuf: {key1: '0'} } }
        const res = {
            locals: {
                userId: "rob",
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateMapPublishStatus(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    })
})

describe("mapmetadata/:id", () => {
    it("returns 400 if no id", async () => {
        const res = await request(app).get("/api/mapmetadata/:id").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 400 since id is not valid object id", async () => {
        const res = await request(app)
            .get("/api/mapmetadata/:id")
            .send({ id: 0 })
        expect(res.statusCode).toEqual(400)
    })
})

describe("mapbyuser/:id", () => {
    it("returns code 400 if no user id", async () => {
        const res = await request(app).get("/api/mapbyuser/:id").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since id is not valid object id", async () => {
        const res = await request(app)
            .get("/api/mapbyuser/:id")
            .send({ userId: "cyan boy" })
        expect(res.statusCode).toEqual(400)
    })
})

describe("mapgeojson/:id", () => {
    it("returns code 400 if no id", async () => {
        const res = await request(app).get("/api/mapgeojson/:id").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since id is not valid object id", async () => {
        const res = await request(app)
            .get("/api/mapgeojson/:id")
            .send({ id: "100298" })
        expect(res.statusCode).toEqual(400)
    })
})

describe("newMap", () => {
    it("returns code 400 if no title and/or json is given", async () => {
        const res = await request(app).post("/api/newmap").send({ type: "map" })
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).errorMessage).toEqual("Invalid request.")
    })
    it("returns code 400 if no json is given", async () => {
        const res = await request(app)
            .post("/api/newmap")
            .send({ title: "US states", type: "map" })
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).errorMessage).toEqual("Invalid request.")
    })
    it("returns code 400 if type is not valid", async () => {
        const res = await request(app)
            .post("/api/newmap")
            .send({ title: "US states", type: "map", json: " " })
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).errorMessage).toEqual("Invalid request.")
    })
    it("returns code 400 since json is empty string", async () => {
        const res = await request(app)
            .post("/api/newmap")
            .send({ title: "US states", type: "heatmap", json: " " })
        expect(res.statusCode).toEqual(400)
    })
})

describe("duplicatemap", () => {
    it("returns code 400 if no id is sent", async () => {
        const res = await request(app).post("/api/duplicatemap").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 for invalid id", async () => {
        const res = await request(app)
            .post("/api/duplicatemap")
            .send({ id: "1006298" })
        expect(res.statusCode).toEqual(400)
    })
})

describe("forkMap", () => {
    it("returns code 400 if no id is sent", async () => {
        const res = await request(app).post("/api/forkmap").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since id is invalid", async () => {
        const res = await request(app).post("/api/forkmap").send({ id: "1006298" })
        expect(res.statusCode).toEqual(400)
    })
})

describe("deletemap/:id", () => {
    it("returns code 400 if no id is sent", async () => {
        const res = await request(app).delete("/api/deletemap/:id").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since id is not valid", async () => {
        const res = await request(app)
            .delete("/api/deletemap/:id")
            .send({ id: 100629 })
        expect(res.statusCode).toEqual(400)
    })
})

describe("mapname", () => {
    it("returns code 400 since no id is being passed", async () => {
        const res = await request(app)
            .post("/api/mapname")
            .send({ title: "map" })
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since no id is not valid", async () => {
        const res = await request(app)
            .post("/api/mapname")
            .send({ id: '100689', title: "map" })
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since no title is passed and id is invalid", async () => {
        const res = await request(app)
            .post("/api/mapname")
            .send({ id: '100689' })
        expect(res.statusCode).toEqual(400)
    })
})

describe("maptag", () => {
    it("returns code 400 since id is invalid", async () => {
        const res = await request(app).post("/api/updatemaptag").send({ id: '100629' })
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since no id is given", async () => {
        const res = await request(app).post("/api/updatemaptag").send({})
        expect(res.statusCode).toEqual(400)
    })
})

describe("mapstatus", () => {
    it("returns code 400 since no id given", async () => {
        const res = await request(app)
            .post("/api/publishmap")
            .send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since id is invalid", async () => {
        const res = await request(app)
            .post("/api/publishmap")
            .send({id: '100629'})
        expect(res.statusCode).toEqual(400)
    })
})

describe("mapjson", () => {
    it("returns code 400 since no geobuf given and errors out", async () => {
        const res = await request(app)
            .post("/api/updategeojson")
            .send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since it errors out not having a geobuf", async () => {
        const res = await request(app)
            .post("/api/updategeojson")
            .send({id: '100629'})
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since valid geobuf but invalid id", async () => {
        const res = await request(app)
            .post("/api/updategeojson")
            .send({id: '100629', geoBuf: buffer})
        expect(res.statusCode).toEqual(400)
    })
})

describe("likecomment", () => {
    it("returns code 400 since id is invalid", async () => {
        const res = await request(app).post("/api/likecomment").send({ id: '100629' })
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since no id is given", async () => {
        const res = await request(app).post("/api/likecomment").send({})
        expect(res.statusCode).toEqual(400)
    })
})

describe("dislikecomment", () => {
    it("returns code 400 since id is invalid", async () => {
        const res = await request(app).post("/api/dislikecomment").send({ id: '100629' })
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since no id is given", async () => {
        const res = await request(app).post("/api/dislikecomment").send({})
        expect(res.statusCode).toEqual(400)
    })
})

describe("likemap", () => {
    it("returns code 400 since id is invalid", async () => {
        const res = await request(app).post("/api/likemap").send({ id: '100629' })
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since no id is given", async () => {
        const res = await request(app).post("/api/likemap").send({})
        expect(res.statusCode).toEqual(400)
    })
})

describe("dislikemap", () => {
    it("returns code 400 since id is invalid", async () => {
        const res = await request(app).post("/api/dislikemap").send({ id: '100629' })
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since no id is given", async () => {
        const res = await request(app).post("/api/dislikemap").send({})
        expect(res.statusCode).toEqual(400)
    })
})

describe("postcomment", () => {
    it("returns code 400 since id is invalid and no text given", async () => {
        const res = await request(app).post("/api/postcomment").send({ mapId: '100629' })
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since no id is given", async () => {
        const res = await request(app).post("/api/postcomment").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since no text is given", async () => {
        const res = await request(app).post("/api/postcomment").send({
            mapId: "5f63f8d8e740dbd28d8c822e"
        })
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since no id is invalid", async () => {
        const res = await request(app).post("/api/postcomment").send({
            mapId: "100629",
            text: "hello"
        })
        expect(res.statusCode).toEqual(400)
    })
})

describe("getcommentbyid", () => {
    it("returns code 400 since id is invalid", async () => {
        const res = await request(app).post("/api/getcommentbyid").send({ id: '100629' })
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 since no id is given", async () => {
        const res = await request(app).post("/api/getcommentbyid").send({})
        expect(res.statusCode).toEqual(400)
    })
})
