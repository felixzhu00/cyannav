# Backend API routes

The following are all the possible API endpoints in our server application, as well as their expected return statuses.

All of our endpoints may return with a status of `500`, which indicates an internal server error with our server application or the database.

## Auth APIs

`/auth/loggedIn`: gets the login information of the current user from cookies.

Outputs:

`200`: User is logged in and returns the following JSON data:

    {
        loggedIn,
        user: {
            username,
            email,
            picture,
            userId
        }
    }

`401`: If user is not logged in or has an invalid cookie.

`404`: If user's cookie points to an invalid invalid user.
