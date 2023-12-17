import L from "leaflet";
import shp from "shpjs";
// import omnivore from "@mapbox/leaflet-omnivore";
// const tj = require('togeojson'); // Import the togeojson library
import { interpolateRgb } from 'd3-interpolate';
import h337 from 'heatmapjs';

// import "leaflet.heat"
import { heatLayer } from 'leaflet-heat-es';

// import "leaflet-webgl-heatmap"

import HeatmapOverlay from '../leaflet-heatmap.js';
import * as turf from '@turf/turf';
// import simpleheat from 'simpleheat';


import { useRef, useEffect, useState, useContext } from "react";
import { GlobalStoreContext } from '../store'
import heatmapMin from "heatmapjs";
function NavJSON({ data, center, zoom }) {
    const { store } = useContext(GlobalStoreContext);
    const geolayer = useRef(null)
    const heatmap = useRef(null)
    const map = useRef(null)


    const onEachFeature = (country, layer) => {
        const name1 = country.fields && country.fields.name;
        const name2 = country.properties && country.properties.admin;

        const name = name1 || name2 || "";

        layer.bindPopup(name);

        // Possible map templates : 'heatmap', 'distributiveflowmap', 'pointmap', 'choroplethmap', '3drectangle'

        // Calculate the range of value
        const { min, max } = findMinMax(data);


        // Logic for color picking (choropleth)
        const choroColor = store.byFeature == null ? '#007dff' : getColor(country.fields[store.byFeature], min, max)
        const color = store.currentMap.mapType == 'choroplethmap' ? choroColor : '#007dff'

        // Set the style for every map
        layer.setStyle(
            {
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: store.currentMap.mapType == 'heatmap' ? 0 : 0.7
            }
        )

        // Set the calculated color only when choropleth else its white
        if (store.currentMap.mapType == 'choroplethmap') {
            layer.setStyle(
                {
                    fillColor: color,
                }
            )
        }

        // Control the styling when selecting a certain feature(area)
        layer.on({
            click: toggleSelection,
        });

    }



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
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: store.currentMap.mapType == 'heatmap' ? 0 : 0.7
                });
            }
        });

        if (!isLayerSelected) {
            // Revert to original style
            layer.setStyle({
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: store.currentMap.mapType == 'heatmap' ? 0 : 0.7
            });
            store.setCurrentArea(-1)
            return null;
        } else {
            // Set the selected style
            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: store.currentMap.mapType == 'heatmap' ? 0 : 0.7
            });
            layer.bringToFront();
            store.setCurrentArea(layerIndex)

        }



    };

    const getColor = (d, min, max, color1 = '#FFEDA0', color2 = '#800026') => {
        const percentage = (parseInt(d, 10) - min) / (max - min);
        return interpolateRgb(color1, color2)(percentage);
    };


    const findMinMax = (data) => {
        let min = 0;
        let max = Number.MIN_VALUE;

        if (store.byFeature == null) {
            return { min, max };
        }

        data.features.forEach(feature => {
            const value = parseInt(feature.fields[store.byFeature], 10);
            if (value < min) {
                min = value;
            }
            if (value > max) {
                max = value;
            }
        });

        return { min, max };
    }


    // Called in Choropleth Map Only
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

    const setupHeatMapLayer = (radius) => {
        // console.log("trigger")
        const cfg = {
            radius: radius,
            maxOpacity: 0.8,
            scaleRadius: true,
            useLocalExtrema: true,
            latField: 'lat',
            lngField: 'lng',
            valueField: 'count',
        };

        if (map.current && heatmap.current) {
            map.current.removeLayer(heatmap.current);
        }

        // Create and add the HeatmapOverlay
        const heatmapLayer = new HeatmapOverlay(cfg).addTo(map.current);
        heatmap.current = heatmapLayer;
        // Extract heatmap data from store.geojson
        const heatmapLayerData = store.geojson.features.reduce((acc, feature) => {
            const center = turf.centerOfMass(feature);

            // Check if the intensity value is available and not NaN
            const intensity = feature.fields && feature.fields[store.byFeature]
                ? parseInt(feature.fields[store.byFeature], 10)
                : NaN;

            // Only push if intensity is a valid number
            if (!isNaN(intensity)) {
                acc.push({ lat: center.geometry.coordinates[1], lng: center.geometry.coordinates[0], count: intensity });
            }
            return acc;
        }, []);

        // Set data for the heatmap layer
        heatmapLayer.setData({ data: heatmapLayerData });

        // console.log(heatmapLayerData)
        //Bring the heatmap layer to the front 
        // heatmapLayer._el.style.zIndex = 700;
    };


    const setupPointMapLayer = (radius) => {
        // console.log("trigger");

        if (map.current) {
            // Remove existing circles if any
            map.current.eachLayer(layer => {
                if (layer instanceof L.CircleMarker) {
                    map.current.removeLayer(layer);
                }
            });
        }

        // Extract circle data from store.geojson
        store.geojson.features.forEach(feature => {
            const center = turf.centerOfMass(feature);

            // Check if the count value is available and not NaN
            const count = feature.fields && feature.fields.count
                ? parseInt(feature.fields.count, 10)
                : NaN;

            // Only proceed if count is a valid number
            if (!isNaN(count)) {
                // Create and add circle marker
                const circle = L.circleMarker([center.geometry.coordinates[1], center.geometry.coordinates[0]], {
                    radius: count * radius, // Adjust the radius based on the count
                    fillColor: 'red', // Customize the fill color
                    fillOpacity: 0.8,
                    color: 'black',
                    weight: 1,
                }).addTo(map.current);

                // You can add additional customization for the circles if needed
            }
        });

        // You can also consider bringing the circles to the front if needed
        // map.current.eachLayer(layer => {
        //     if (layer instanceof L.CircleMarker) {
        //         layer.bringToFront();
        //     }
        // });

        // console.log("Circles added");
    };


    useEffect(() => {
        // Initialize the Leaflet map and store its reference in the map ref
        
        const mapInstance = L.map('map').setView([0, 0], 2);
        map.current = mapInstance;
        console.log("effect ran once",map.current.getCenter())

        // Create and add the tile layer
        const OpenStreetMap_DE = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);

        // Create and add the GeoJSON layer
        const geo = L.geoJson(data, {
            onEachFeature: onEachFeature,
        }).addTo(mapInstance);

        geolayer.current = geo;

        const setIntial = map.current.getZoom() == 2 && map.current.getCenter().lat == 0 && map.current.getCenter().lng == 0
        if (map.current && map.current.getBoundsZoom && geolayer.current) {
            // Set the view of the map to fit the GeoJSON bounds
            const geoBounds = geolayer.current.getBounds();
            map.current.setView(geoBounds.getCenter(), map.current.getBoundsZoom(geoBounds) + 1);
        }
        

        // Cleanup function to remove the map and associated layers when the component is unmounted
        return () => {
            mapInstance.remove();
        };
    }, []);

    // Use another useEffect to set the view after the initial render
    useEffect(() => {
        // Possible map templates: 'heatmap', 'distributiveflowmap', 'pointmap', 'choroplethmap', '3drectangle'
        // if (store.currentMap.mapType === 'heatmap') {
        //     // Get the radius as a number, or null if it's not a valid number
        //     const radius = Number(store.geojson.features[0].fields.radius);

        //     // Check if radius is a valid number
        //     if (!isNaN(radius)) {
        //         // console.log(radius);
        //         setupHeatMapLayer(radius);
        //     } else {
        //         // Handle the case where the radius is not a valid number
        //         console.error('Invalid radius:', store.geojson.features[0].fields.radius);
        //     }
        // }else if (store.currentMap.mapType === 'pointmap' && store.geojson.features[0]?.fields?.radius) {

        //     console.log("hello")
        //     const radius = Number(store.geojson.features[0]?.fields?.radius);

        //     // Check if radius is a valid number
        //     if (!isNaN(radius)) {
        //         // console.log(radius);
        //         setupPointMapLayer(radius);
        //     } else {
        //         // Handle the case where the radius is not a valid number
        //         console.error('Invalid radius:', store.geojson.features[0].fields.radius);
        //     }
        //     setupPointMapLayer();
        // }

        setupGeoJSONLayer(data);
    }, [data]);

    useEffect(() => {
        setupGeoJSONLayer(data);
        console.log("current",store.currentMap, store.geojson)
        if (map.current && map.current.getBoundsZoom && geolayer.current) {
            // Set the view of the map to fit the GeoJSON bounds
            const geoBounds = geolayer.current.getBounds();
            map.current.setView(geoBounds.getCenter(), map.current.getBoundsZoom(geoBounds) + 1);
        }
    }, [store.currentMap]);


    return <div id="map" style={{ height: "100vh" }}></div>;
}

export default NavJSON;

