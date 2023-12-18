import L from "leaflet";
import shp from "shpjs";
// import omnivore from "@mapbox/leaflet-omnivore";
// const tj = require('togeojson'); // Import the togeojson library
import { interpolateRgb } from "d3-interpolate";

import { useRef, useEffect, useState, useContext } from "react";
import { GlobalStoreContext } from "../store";
function NavJSON({ data, center, zoom }) {
    const { store } = useContext(GlobalStoreContext);
    const geolayer = useRef(null);
    const map = useRef(null);

    const onEachFeature = (country, layer) => {
        const name1 = country.fields && country.fields.name;
        const name2 = country.properties && country.properties.admin;
        const name3 = country.properties && country.properties.NAME_0;

        const name = name1 || name2 || name3 || "";

        layer.bindPopup(name);

        // Calculate the range of value
        const { min, max } = findMinMax(data);

        layer.setStyle({
            fillColor:
                store.byFeature == null
                    ? "red"
                    : getColor(country.fields[store.byFeature], min, max),
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.7,
        });

        layer.on({
            click: toggleSelection,
        });
    };

    const toggleSelection = (e) => {
        const layer = e.target;
        const isLayerSelected = layer.options.weight === 2;

        let layerIndex = -1;
        let currentIndex = 0;

        geolayer.current.eachLayer((otherLayer) => {
            if (otherLayer._bounds.equals(layer._bounds)) {
                layerIndex = currentIndex;
            }
            currentIndex++;
        });

        geolayer.current.eachLayer((otherLayer) => {
            if (otherLayer !== layer) {
                otherLayer.setStyle({
                    weight: 2,
                    opacity: 1,
                    color: "white",
                    dashArray: "3",
                    fillOpacity: 0.7,
                });
            }
        });

        if (!isLayerSelected) {
            // Revert to original style
            layer.setStyle({
                weight: 2,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: 0.7,
            });
            store.setCurrentArea(-1);
            return null;
        } else {
            // Set the selected style
            layer.setStyle({
                weight: 5,
                color: "#666",
                dashArray: "",
                fillOpacity: 0.7,
            });
            layer.bringToFront();
            store.setCurrentArea(layerIndex);
        }
    };

    const getColor = (d, min, max, color1 = "#FFEDA0", color2 = "#800026") => {
        const percentage = (parseInt(d, 10) - min) / (max - min);
        return interpolateRgb(color1, color2)(percentage);
    };

    const findMinMax = (data) => {
        let min = 0;
        let max = Number.MIN_VALUE;

        if (store.byFeature == null) {
            return { min, max };
        }

        data.features.forEach((feature) => {
            const value = parseInt(feature.fields[store.byFeature], 10);
            if (value < min) {
                min = value;
            }
            if (value > max) {
                max = value;
            }
        });

        return { min, max };
    };

    const setupGeoJSONLayer = (geoData) => {
        if (map.current && geolayer.current) {
            // Remove the existing GeoJSON layer
            geolayer.current.clearLayers();

            // Create and add the new GeoJSON layer
            const newGeo = L.geoJson(geoData, {
                onEachFeature: onEachFeature,
            }).addTo(map.current);

            // Update the geolayer ref
            geolayer.current = newGeo;
        }
    };

    useEffect(() => {
        // Initialize the Leaflet map and store its reference in the map ref
        const mapInstance = L.map("map");
        map.current = mapInstance;

        // Create and add the tile layer
        const OpenStreetMap_DE = L.tileLayer(
            "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
            {
                maxZoom: 18,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }
        ).addTo(mapInstance);

        console.log("data", data);
        // Create and add the GeoJSON layer
        const geo = L.geoJson(data, {
            onEachFeature: onEachFeature,
        }).addTo(mapInstance);

        geolayer.current = geo;

        // Cleanup function to remove the map and associated layers when the component is unmounted
        return () => {
            mapInstance.remove();
        };
    }, []);

    // Use another useEffect to set the view after the initial render
    useEffect(() => {
        if (map.current && map.current.getBoundsZoom && geolayer.current) {
            // Set the view of the map to fit the GeoJSON bounds
            const geoBounds = geolayer.current.getBounds();
            map.current.setView(
                geoBounds.getCenter(),
                map.current.getBoundsZoom(geoBounds)
            );
        }
        setupGeoJSONLayer(data);
    }, [data]);

    return <div id="map" style={{ height: "100vh" }}></div>;
}

export default NavJSON;
