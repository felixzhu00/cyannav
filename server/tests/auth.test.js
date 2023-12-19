// Environmental vairables for testing.\

//renamed because of weird error during testing causing cases to fail. will fix bug and naming in build 5
process.env.SERVER_PORT = 8001
process.env.SERVER_ADDRESS = "localhost"
process.env.JWT_SECRET = "testing"

const app = require("../index.js")
const request = require("supertest")
const auth = require("../auth") // This is the auth manager, so some code should be abstracted to this file.
const bcrypt = require("bcrypt");

const {
    loggedIn,
    login,
    logout,
    register,
    resetRequest,
    verifyCode,
    updatePasscodeNotLoggedIn,
    updatePasscode,
    updateUsername,
    updateEmail,
    deleteAccount,
    updateProfilePic,
} = require("../controllers/auth-controller.js")

const mapGraphicSchema = require("../schemas/mapGraphicSchema")
const passcodeSchema = require("../schemas/passcodeSchema")
const tagSchema = require("../schemas/tagSchema")
const userProfileSchema = require("../schemas/userProfileSchema")

jest.mock('../schemas/mapGraphicSchema');
jest.mock('../schemas/passcodeSchema');
jest.mock('../schemas/tagSchema');
jest.mock('../schemas/userProfileSchema');
jest.mock("bcrypt")

afterEach(() => {
    jest.clearAllMocks()
})

/* Auth API Tests */

describe("loggedIn function", () => {
    jest.mock('../auth');

    it("returns 401 if auth cannot verify user", async () => {
        auth.verifyUser = jest.fn().mockReturnValueOnce(false)
        const req = { email: "test", password: "pass" }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await loggedIn(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            loggedIn: false,
            user: null,
        })
    })
    it("returns 404 if no user matching userId", async () => {
        auth.verifyUser = jest.fn().mockReturnValueOnce(1)
        userProfileSchema.findOne=jest.fn().mockResolvedValueOnce(false)
        const req = { email: "test", password: "pass" }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await loggedIn(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            loggedIn: false,
            user: null,
        })
    })
    it("returns 200 if user is logged in", async () => {
        auth.verifyUser = jest.fn().mockReturnValueOnce(1)
        userProfileSchema.findOne=jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: [], // TODO: figure out profile picture
            userId: 1,
        })
        const req = { email: "test", password: "pass" }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await loggedIn(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            loggedIn: true,
            user: {
                username: "username",
                email: "email",
                picture: [], // TODO: figure out profile picture
                userId: 1,
            },
        })
    })
})

describe("login function", () => {
    jest.mock('../auth');

    it("returns 401 if auth cannot login user", async () => {
        userProfileSchema.findOne=jest.fn().mockResolvedValueOnce(false)
        const req = { body: {email: "test", password: "pass"} }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await login(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            loggedIn: false,
            user: null,
            errorMessage: "Wrong email or password",
        })
    })
    it("returns 200 if auth can login user", async () => {
        userProfileSchema.findOne=jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "pass",
        })
        bcrypt.compare = jest.fn().mockResolvedValueOnce(true)
        auth.signToken = jest.fn().mockReturnValueOnce(1)

        const req = { body: {email: "test", password: "pass"} }
        const res = {
            cookie: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await login(req, res)

        expect(res.cookie).toHaveBeenCalledWith("access_token", 1, {
            httpOnly: true, // TODO: HTTPS: change this later when HTTPS is introduced.
            secure: false,
            // withCredentials: true,
            sameSite: true,
        })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            loggedIn: true,
                user: {
                    username: "username",
                    email: "email",
                    picture: null, // TODO: figure out profile picture
                },
        })
    })
})

describe("register function", () => {
    jest.mock('../auth');

    it("returns 401 if no user found", async () => {
        userProfileSchema.findOne=jest.fn().mockResolvedValueOnce(true)

        const req = { body: {
            email: "test",
            username: "user",
            password: "11223344$$",
            passwordVerify: "11223344$$"
        }}
        const res = {
            cookie: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await register(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            loggedIn: false,
            user: null,
            errorMessage: "Email is already in use.",
        })
    })
    it("returns 500 if cannot save user to db", async () => {
        userProfileSchema.findOne=jest.fn().mockResolvedValueOnce(false)
        const mockUserProfileSchemaInstance = {
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "pass",
            save: jest.fn().mockResolvedValueOnce(false),
          };
        userProfileSchema.mockImplementationOnce(() => mockUserProfileSchemaInstance);
        bcrypt.hash = jest.fn().mockResolvedValueOnce(true)
        auth.signToken = jest.fn().mockReturnValueOnce(1)

        const req = { body: {
            email: "test",
            username: "user",
            password: "11223344$$",
            passwordVerify: "11223344$$"
        }}
        const res = {
            cookie: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await register(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("returns 200 if auth can register user", async () => {
        userProfileSchema.findOne=jest.fn().mockResolvedValueOnce(false)
        const mockUserProfileSchemaInstance = {
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "pass",
            save: jest.fn().mockResolvedValueOnce({
                username: "username",
                email: "email",
                picture: null, // TODO: figure out profile picture
                password: "pass"
            }),
        };
        userProfileSchema.mockImplementationOnce(() => mockUserProfileSchemaInstance);
        bcrypt.hash = jest.fn().mockResolvedValueOnce(true)
        auth.signToken = jest.fn().mockReturnValueOnce(1)

        const req = { body: {
            email: "test",
            username: "user",
            password: "11223344$$",
            passwordVerify: "11223344$$"
        }}
        const res = {
            cookie: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await register(req, res)

        expect(res.cookie).toHaveBeenCalledWith("access_token", 1, {
            httpOnly: true, // TODO: change this later when HTTPS is introduced.
            secure: false,
            sameSite: true,
        })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            loggedIn: true,
                user: {
                    username: "username",
                    email: "email",
                    picture: null, // TODO: figure out profile picture
                },
        })
    })
})

describe("resetRequest function", () => {
    jest.mock('../auth');

    it("returns 401 if no user found", async () => {
        userProfileSchema.findOne=jest.fn().mockResolvedValueOnce(false)

        const req = { body: {email: "test"} }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await resetRequest(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            user: null,
            errorMessage: "Email is not associated with a user",
        })
    })
    it("returns 200 if verification code already exists in db and isnt expired", async () => {
        userProfileSchema.findOne=jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        passcodeSchema.findOne = jest.fn().mockResolvedValueOnce({
            userEmail: "email",
            creationDate: Date.now(),
            expirationData: 600,
            passcode: "123456"
        })

        const req = { body: {email: "test"} }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await resetRequest(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    })
    it("returns 500 if passcode cannot save", async () => {
        userProfileSchema.findOne=jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        passcodeSchema.findOne = jest.fn().mockResolvedValueOnce(false)
        const mockPasscodeSchemaInstance = {
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
            save: jest.fn().mockResolvedValueOnce(false),
        };
        passcodeSchema.mockImplementationOnce(() => mockPasscodeSchemaInstance);

        const req = { body: {email: "test"} }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await resetRequest(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
})

describe("verifyCode function", () => {
    jest.mock('../auth');

    it("returns 401 if no passcode associated with email", async () => {
        passcodeSchema.findOne = jest.fn().mockResolvedValueOnce(false)

        const req = { body: {email: "test", passcode: "123456"} }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await verifyCode(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            errorMessage: "No verification code associated with this email",
        })
    })
    it("returns 500 if old passcode does not delete", async () => {
        passcodeSchema.findOne = jest.fn().mockResolvedValueOnce({
            userEmail: "email",
            creationDate: Date.now(),
            expirationData: 600,
            passcode: "123456"
        })
        passcodeSchema.findByIdAndDelete = jest.fn().mockResolvedValueOnce(false)

        const req = { body: {email: "test", passcode: "123456"} }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await verifyCode(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("returns 200 if verifyCode was successful", async () => {
        passcodeSchema.findOne = jest.fn().mockResolvedValueOnce({
            userEmail: "email",
            creationDate: Date.now(),
            expirationData: 600,
            passcode: "123456"
        })
        passcodeSchema.findByIdAndDelete = jest.fn().mockResolvedValueOnce(true)

        const req = { body: {email: "test", passcode: "123456"} }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await verifyCode(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            email: "email",
        })
    })
})

describe("updatePasscodeNotLoggedIn function", () => {
    jest.mock('../auth');

    it("returns 401 if no user associated with email", async () => {
        userProfileSchema.findOne = jest.fn().mockResolvedValueOnce(false)

        const req = { body: {
            email: "test",
            password: "11223344$$",
            confirmPassword: "11223344$$"
        }}
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updatePasscodeNotLoggedIn(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            errorMessage: "No user with this email exists",
        })
    })
    it("returns 500 if error when hashing password", async () => {
        userProfileSchema.findOne = jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        bcrypt.hash=jest.fn().mockResolvedValueOnce(false)

        const req = { body: {
            email: "test",
            password: "11223344$$",
            confirmPassword: "11223344$$"
        }}
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updatePasscodeNotLoggedIn(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("returns 500 if user failed to update", async () => {
        userProfileSchema.findOne = jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        bcrypt.hash=jest.fn().mockResolvedValueOnce(true)
        userProfileSchema.findByIdAndUpdate=jest.fn().mockResolvedValueOnce(false)

        const req = { body: {
            email: "test",
            password: "11223344$$",
            confirmPassword: "11223344$$"
        }}
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updatePasscodeNotLoggedIn(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("returns 200 if updating password was successful", async () => {
        userProfileSchema.findOne = jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        bcrypt.hash=jest.fn().mockResolvedValueOnce(true)
        userProfileSchema.findByIdAndUpdate=jest.fn().mockResolvedValueOnce(true)

        const req = { body: {
            email: "test",
            password: "11223344$$",
            confirmPassword: "11223344$$"
        }}
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updatePasscodeNotLoggedIn(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            email: "test",
        })
    })
})

describe("updatePasscode function", () => {
    jest.mock('../auth');

    it("returns 401 if user is not logged in", async () => {

        const req = { body: {
            originalPassword: "11223344$$",
            password: "11223344&&",
            passwordVerify: "11223344&&"
        }}
        const res = {
            locals: {
                userId: false
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updatePasscode(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            errorMessage: "User is not logged in."        
        })
    })
    it("returns 401 if password entered is incorrect", async () => {
        userProfileSchema.findById = jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        bcrypt.compare=jest.fn().mockResolvedValueOnce(false)

        const req = { body: {
            originalPassword: "11223344$$",
            password: "11223344&&",
            passwordVerify: "11223344&&"
        }}
        const res = {
            locals: {
                userId: true
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updatePasscode(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            errorMessage: "Incorrect original password."
        })
    })
    it("returns 500 if error in bcrypt for hashing", async () => {
        userProfileSchema.findById = jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        bcrypt.compare=jest.fn().mockResolvedValueOnce(true)
        bcrypt.hash=jest.fn().mockResolvedValueOnce(false)

        const req = { body: {
            originalPassword: "11223344$$",
            password: "11223344&&",
            passwordVerify: "11223344&&"
        }}
        const res = {
            locals: {
                userId: true
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updatePasscode(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("returns 500 if user could not be updated", async () => {
        userProfileSchema.findById = jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        bcrypt.compare=jest.fn().mockResolvedValueOnce(true)
        bcrypt.hash=jest.fn().mockResolvedValueOnce(true)
        userProfileSchema.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(false)

        const req = { body: {
            originalPassword: "11223344$$",
            password: "11223344&&",
            passwordVerify: "11223344&&"
        }}
        const res = {
            locals: {
                userId: true
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updatePasscode(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("returns 200 if passcode updated successfully", async () => {
        userProfileSchema.findById = jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        bcrypt.compare=jest.fn().mockResolvedValueOnce(true)
        bcrypt.hash=jest.fn().mockResolvedValueOnce(true)
        userProfileSchema.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(true)

        const req = { body: {
            originalPassword: "11223344$$",
            password: "11223344&&",
            passwordVerify: "11223344&&"
        }}
        const res = {
            locals: {
                userId: true
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updatePasscode(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    })
})

describe("updateUsername function", () => {
    jest.mock('../auth');

    it("returns 401 if username already exists", async () => {
        userProfileSchema.findOne = jest.fn().mockResolvedValueOnce(true)

        const req = { body: {
            newUsername: "username"
        }}
        const res = {
            locals: {
                userId: true
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }

        await updateUsername(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            errorMessage: "Username is already taken.",
        })
    })
    it("returns 500 if user fails to find one and update", async () => {
        userProfileSchema.findOne = jest.fn().mockResolvedValueOnce(false)
        userProfileSchema.findOneAndUpdate = jest.fn().mockResolvedValueOnce(false)

        const req = { body: {
            newUsername: "username"
        }}
        const res = {
            locals: {
                userId: true
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateUsername(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("returns 200 if username was updated successfully", async () => {
        userProfileSchema.findOne = jest.fn().mockResolvedValueOnce(false)
        userProfileSchema.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })

        const req = { body: {
            newUsername: "username"
        }}
        const res = {
            locals: {
                userId: true
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateUsername(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    })
})

describe("updateEmail function", () => {
    jest.mock('../auth');

    it("returns 401 if email already exists", async () => {
        userProfileSchema.countDocuments = jest.fn().mockResolvedValueOnce(1)

        const req = { body: {
            newEmail: "newEmail"
        }}
        const res = {
            locals: {
                userId: true
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }

        await updateEmail(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            errorMessage: "Email not unique.",
        })
    })
    it("returns 500 if error finding user and updating", async () => {
        userProfileSchema.countDocuments = jest.fn().mockResolvedValueOnce(0)
        userProfileSchema.findOneAndUpdate = jest.fn().mockResolvedValueOnce(false)

        const req = { body: {
            newEmail: "newEmail"
        }}
        const res = {
            locals: {
                userId: true
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }

        await updateEmail(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("returns 200 if email was updated successfully", async () => {
        userProfileSchema.findOne = jest.fn().mockResolvedValueOnce(false)
        userProfileSchema.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })

        const req = { body: {
            newEmail: "newEmail"
        }}
        const res = {
            locals: {
                userId: true
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }
        await updateEmail(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    })
})

describe("updateProfilePic function", () => {
    jest.mock('../auth');

    it("returns 401 if user is not verified", async () => {
        auth.verifyUser = jest.fn().mockReturnValueOnce(false)
        const req = { body: {
            newEmail: "newEmail"
        }}
        const res = {
            locals: {
                userId: true
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }

        await updateProfilePic(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            errorMessage: "Unauthorized"
        })
    })
    it("returns 404 if user is not found in db", async () => {
        auth.verifyUser = jest.fn().mockReturnValueOnce(1)
        userProfileSchema.findById=jest.fn().mockResolvedValueOnce(false)
        const req = { body: {
            newEmail: "newEmail"
        }}
        const res = {
            locals: {
                userId: true
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }

        await updateProfilePic(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            errorMessage: "User not found"        
        })
    })
})

describe("deleteAccount function", () => {
    jest.mock('../auth');

    it("returns 401 if userID is null", async () => {
        const req = { body: {
            username: "username",
            email: "newEmail",
            password: "11223344$$"
        }}
        const res = {
            locals: {
                userId: null
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }

        await deleteAccount(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
    })
    it("returns 401 if usernames do not match", async () => {
        userProfileSchema.findById=jest.fn().mockResolvedValueOnce({
            username: "username1",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        const req = { body: {
            username: "username",
            email: "newEmail",
            password: "11223344$$"
        }}
        const res = {
            locals: {
                userId: 1
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }

        await deleteAccount(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            errorMessage: "Username does not match",
        })
    })
    it("returns 401 if emails do not match", async () => {
        userProfileSchema.findById=jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email1",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        const req = { body: {
            username: "username",
            email: "newEmail",
            password: "11223344$$"
        }}
        const res = {
            locals: {
                userId: 1
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }

        await deleteAccount(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            errorMessage: "Email does not match.",
        })
    })
    it("returns 401 if passwords do not match", async () => {
        userProfileSchema.findById=jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        bcrypt.compare=jest.fn().mockResolvedValueOnce(false)
        const req = { body: {
            username: "username",
            email: "email",
            password: "11223344$$"
        }}
        const res = {
            locals: {
                userId: 1
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }

        await deleteAccount(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            errorMessage: "Password does not match",
        })
    })
    it("returns 500 if deleting user errors out", async () => {
        userProfileSchema.findById=jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        bcrypt.compare=jest.fn().mockResolvedValueOnce(true)
        userProfileSchema.findByIdAndDelete=jest.fn().mockResolvedValueOnce(false)
        const req = { body: {
            username: "username",
            email: "email",
            password: "11223344$$"
        }}
        const res = {
            locals: {
                userId: 1
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }

        await deleteAccount(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
    })
    it("returns 200 if user was successfully deleted", async () => {
        userProfileSchema.findById=jest.fn().mockResolvedValueOnce({
            username: "username",
            email: "email",
            picture: null, // TODO: figure out profile picture
            password: "11223344$$",
        })
        bcrypt.compare=jest.fn().mockResolvedValueOnce(true)
        userProfileSchema.findByIdAndDelete=jest.fn().mockResolvedValueOnce(true)
        const req = { body: {
            username: "username",
            email: "email",
            password: "11223344$$"
        }}
        const res = {
            locals: {
                userId: 1
            },
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        }

        await deleteAccount(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    })
})

describe("updateProfilePic", () => {
    it("returns 401 since user is unauthorized", async () => {
        const res = await request(app).post("/auth/updateProfilePic").send({})
        expect(res.statusCode).toEqual(401)
        expect(JSON.parse(res.text).errorMessage).toEqual("Unauthorized")
    })
})

describe("loggedIn", () => {
    it("returns 401 since user is not logged in", async () => {
        const res = await request(app).get("/auth/loggedIn").send({})
        expect(res.statusCode).toEqual(401)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
    })
})

describe("login", () => {
    it("returns 400 if no password", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: "hi@hello.com" })
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    })
    it("returns 400 if no email", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ password: "password" })
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    })
    it("returns 400 if no email nor password", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({})
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    })
})

describe("logout", () => {
    it("shoudl always return 200", async () => {
        const res = await request(app).post("/auth/logout").send({})
        expect(res.statusCode).toEqual(200)
    })
})

describe("register", () => {
    it("returns 400 if no password", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ email: "hi@hello.com" })
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    })
    it("returns 400 if no email", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ password: "password" })
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    })
    it("returns 400 if no email nor password", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({})
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    })
    it("returns 401 if password does not match passwordVerify", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ email: "hi", username: "hello", password: "hi", passwordVerify: "hello" })
        expect(res.statusCode).toEqual(401)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Passwords do not match")
    })
    it("returns 401 if password is not long enough", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ email: "hi", username: "hello", password: "hi$$", passwordVerify: "hi$$" })
        expect(res.statusCode).toEqual(401)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Password fails security requirement.")
    })
    it("returns 401 if password does not contain 2 special characters", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ email: "hi", username: "hello", password: "1234567890", passwordVerify: "1234567890" })
        expect(res.statusCode).toEqual(401)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Password fails security requirement.")
    })
})

describe('reset', () => {
    it('returns 400 if no email', async () => {
        const res = await request(app).post('/auth/reset').send({});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
})

describe('verifyCode', () => {
    it('returns 400 if no params passed', async () => {
        const res = await request(app).post('/auth/verifyCode').send({});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
    it('returns 400 if no email', async () => {
        const res = await request(app).post('/auth/verifyCode').send({passcode: 111111});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
    it('returns 400 if no code', async () => {
        const res = await request(app).post('/auth/verifyCode').send({email: "test@hi.com"});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
});

describe('updatePasscodeNotLoggedInCode', () => {
    it('returns 400 if no params passed', async () => {
        const res = await request(app).post('/auth/updatePasscodeNotLoggedIn').send({});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
    it('returns 400 if no email', async () => {
        const res = await request(app).post('/auth/updatePasscodeNotLoggedIn').send({password: "password"});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
    it('returns 400 if no code', async () => {
        const res = await request(app).post('/auth/updatePasscodeNotLoggedIn').send({email: "test@hi.com"});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
    it('returns 401 if passwords do not match', async () => {
        const res = await request(app).post('/auth/updatePasscodeNotLoggedIn').send({
            email: "test@hi.com",
            password: "hi",
            confirmPassword: "hello"
        });
        expect(res.statusCode).toEqual(401);
        expect(JSON.parse(res.text).errorMessage).toEqual("Passwords do not match")
    });
});

describe('updatePass', () => {
    it('returns 400 if no params passed', async () => {
        const res = await request(app).post('/auth/updatePass').send({});
        expect(res.statusCode).toEqual(400);
    });
    it('returns 400 if no original password and no verification code', async () => {
        const res = await request(app).post('/auth/updatePass').send({
            password: "newpass",
            passwordVerify: "diffpass",
        });
        expect(res.statusCode).toEqual(400);
    });
    it('returns 400 if original password and verification code', async () => {
        const res = await request(app).post('/auth/updatePass').send({
            originalPassword: "password",
            password: "newpass",
            passwordVerify: "diffpass",
            verificationCode: 111111
        });
        expect(res.statusCode).toEqual(400);
    });
    it('returns 401 if passwords do not match', async () => {
        const res = await request(app).post('/auth/updatePass').send({
            originalPassword: "password",
            password: "newpass",
            passwordVerify: "diffpass",
        });
        expect(res.statusCode).toEqual(401);
        expect(JSON.parse(res.text).errorMessage).toEqual("Passwords do not match.")
    });
});

describe("updateUsername", () => {
    it("returns 400 if no username", async () => {
        const res = await request(app).post("/auth/updateUsername").send({})
        expect(res.statusCode).toEqual(400)
    })
})

describe("updateEmail", () => {
    it("returns 400 if no email", async () => {
        const res = await request(app).post("/auth/updateEmail").send({})
        expect(res.statusCode).toEqual(400)
    })
})

describe("deleteAccount", () => {
    it("returns 400 if no params passed", async () => {
        const res = await request(app).post("/auth/deleteAccount").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 400 if no email or password", async () => {
        const res = await request(app).post("/auth/deleteAccount").send({username: "hi"})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 400 if no email", async () => {
        const res = await request(app).post("/auth/deleteAccount").send({username: "hi", password: "pass"})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 400 if no username", async () => {
        const res = await request(app).post("/auth/deleteAccount").send({email: "hi", password: "pass"})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 401 since user is not logged in", async () => {
        const res = await request(app).post("/auth/deleteAccount").send({
            username: "user",
            email: "hi",
            password: "pass"
        })
        expect(res.statusCode).toEqual(401)
    })
})
