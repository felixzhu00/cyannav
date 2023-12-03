# Backend API routes

The following are all the possible API endpoints in our server application, as well as their expected return statuses.

All of our endpoints may return with a status of `500`, which indicates an internal server error with our server application or the database.

## Auth APIs

### `/auth/loggedIn`

Gets the login information of the current user from cookies.

Statuses:

`200`: User is logged in and returns the following JSON data:

    {
        loggedIn: Boolean,
        user: {
            username: String,
            email: String,
            picture: Buffer,
            userId: String,
        }
    }

`401`: If user is not logged in or has an invalid cookie.

`404`: If user's cookie points to an invalid invalid user.

### `/auth/login`

Login user given credentials.

Input: `email` and `password`

Statuses:

`200`: Returns the following JSON data:

    {
        loggedIn, Boolean,
        user: {
            username: String,
            email: String,
            picture: Buffer,
        }
    }

`400`: If any fields are invalid.

`401`: Wrong email or password

### `/auth/logout`

Logs out current user.

Statuses:

`200`: Sets clients cookie to expire.

### `/auth/register`

Register a new user.

Inputs:

    email: String
    username: String
    password: String
    passwordVerify: String

Statuses:

`400`: Any of fields are invalid.

`401`: Comes with JSON data containing `errorMessage`.

`200`: Successfully registers, user is given a logged in cookie and the following JSON data is returned:

    {
        loggedIn: Boolean
        user: {
            username: String,
            email: String,
            picture: Buffer
        }
    }

### `/auth/reset`

Not yet implemented.

### `/auth/verifyCode`

Not yet implemented.

### `/auth/updatePass`

Updates user's password.

Inputs:

    verificationCode: String
    originalPassword: String
    password: String
    passwordVierfy: String

Only one of verifictaionCode and originalPassword needs to be supplied.

Statuses:

`200`: Update password success.

`400`: Input fields are invalid.

`401`: Comes with JSON data containing `errorMessage`.

### `/auth/updateUsername`

Updates user's username.

Input:

    newUsername: String

Statuses:

`200`: Username updated successfully.

`400`: Input field is not valid.

`401`: New username is already taken.

### `/auth/updateEmail`

Updates user's email.

Input:

    newEmail: String

Statuses:

`200`: Email updated successfully.

`400`: Input field is not valid.

`401`: New email is already in use.

### `/auth/deleteAccount`

Deletes the user's account

Inputs:

    username: String
    email: String
    password: String

Statuses:

`200`: The user's account is deleted.

`400`: Any of the fields are missing.

`401`: Comes with JSON data with `errorMessage`.

## Map APIs
