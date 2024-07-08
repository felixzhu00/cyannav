# CyanNav

## Description

Free and open-source collaborative map editing software.

## Features

-   Shapefiles, GeoJSON, and Keyhole Markup Language import support
-   User collaboration features:
    -   Like/Dislike maps
    -   Commenting on a map
-   Associate tags to your maps

## Development

-   **How to start the client:** `npm start`
-   **How to start backend:** `nodemon index.js`
-   **Install MongoDB**

## Production

HTTP Website:

-   Uncomment and comment appropriate lines in client/Dockerfile
-   Modify `.env.production` in server (See other .env for example)
-   Run `docker-compose up -d --build`

HTTPs Website:

-   Create https certificate with [certbot](https://certbot.eff.org/)
-   Modify client/nginx/default.conf as necessary
-   Modify `.env.production` in server (See other .env for example)
-   Run `docker-compose up -d --build`

## Pages

-   Browse Page
    ![Browse Page](/client/src/assets/Browse_Page.png)
-   Profile Page
    ![Browse Page](/client/src/assets/Profile_Page.png)
-   Map Page
    ![Browse Page](/client/src/assets/Map_Viewing_Page.png)
