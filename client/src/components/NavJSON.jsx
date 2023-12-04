import L from "leaflet";
import shp from "shpjs";
// import omnivore from "@mapbox/leaflet-omnivore";
// const tj = require('togeojson'); // Import the togeojson library

import { useRef, useEffect, useState } from "react";

function NavJSON({ data }) {


    const [currentArea, setcurrentArea] = useState(null)
    const [geolayer, setGeo] = useState(null);

    const onEachFeature = (country, layer) => {
        const name = country.properties.admin;
        layer.bindPopup(name);

        const { min, max } = findMinMaxGDP(data);

        layer.setStyle(
            {
                fillColor: getColor(country.properties.gdp_md, min, max),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            }
        )

        layer.on({
            click: toggleSelection
        });

    }

    const toggleSelection = (e) => {
        const layer = e.target;
        const selectedArea = layer.feature.properties.admin;
        const isLayerSelected = layer.options.weight === 2;

        setGeo((prevGeo) => {
            prevGeo.eachLayer((otherLayer) => {
                if (otherLayer !== layer) {
                    otherLayer.setStyle({
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    });
                }
            });
            return prevGeo;
        });

        if (!isLayerSelected) {
            // Revert to original style
            layer.setStyle({
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            });

            return null;
        } else {
            // Set the selected style
            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });
            layer.bringToFront();
        }

        setcurrentArea(selectedArea)
    };

    const getColor = (d, min, max) => {
        const percentage = (d - min) / (max - min); // Calculate the percentage value between min and max
        return interpolateColor('#FFEDA0', '#800026', percentage); // Interpolate color between '#FFEDA0' and '#800026'
    }


    const interpolateColor = (color1, color2, percentage) => {
        // Parse colors as hex values
        const hex1 = parseInt(color1.slice(1), 16);
        const hex2 = parseInt(color2.slice(1), 16);

        // Calculate interpolated color
        return ('#' + Math.round(hex1 + percentage * (hex2 - hex1)).toString(16));

    }

    const findMinMaxGDP = (data) => {
        let min = Number.MAX_VALUE;
        let max = Number.MIN_VALUE;

        data.features.forEach(feature => {
            const gdp = feature.properties.gdp_md;
            if (gdp < min) {
                min = gdp;
            }
            if (gdp > max) {
                max = gdp;
            }
        });

        return { min, max };
    }


    useEffect(() => {
        //Map Container
        const map = L.map('map').setView([0, 0], 2);

        // TileLayer
        var OpenStreetMap_DE = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const geo = L.geoJson(
            { features: [] },
            {
                onEachFeature: onEachFeature, // Use the onEachFeature prop
            }
        ).addTo(map);


        // GeoJSON
        geo.addData(data);


        // Set the view of the map(Zoom and center)
        const bounds = geo.getBounds();
        const center = bounds.getCenter();
        const zoom = map.getBoundsZoom(bounds);
        map.setView(center, zoom);


        setGeo(geo);


        // Cleanup function to remove the map and associated layers when the component is unmounted
        return () => {
            map.remove();
        };

    }, [data]);

    return <div id="map" style={{ height: "100vh" }}></div>;
}

export default NavJSON;

