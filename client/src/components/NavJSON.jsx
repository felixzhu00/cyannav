import L from "leaflet";
import { interpolateRgb } from "d3-interpolate";
import HeatmapOverlay from "../leaflet-heatmap.js";
// import * as turf from "@turf/turf";
import { useRef, useEffect, useState, useContext } from "react";
import { GlobalStoreContext } from "../store";
import tinycolor from "tinycolor2";

function NavJSON({ data, center, zoom }) {
    const { store } = useContext(GlobalStoreContext);
    const geolayer = useRef(null);
    const heatmap = useRef(null);
    const map = useRef(null);

    const onEachFeature = (country, layer, isPicking=false) => {
        const name1 = country?.fields?.immutable?.name;
        const name2 = country.properties && country.properties.admin;
        const name3 = country.properties && country.properties.NAME_0;

        const name = name1 || name2 || name3 || "";

        layer.bindPopup(name);
        const { min, max } = findMinMax(data);
        // Possible map templates : 'heatmap', 'distributiveflowmap', 'pointmap', 'choroplethmap', '3drectangle'

        // Set the style for every map
        layer.setStyle({
            weight: 2,
            opacity: 1,
            color: "white",
            fillOpacity: store?.currentMap?.mapType == "heatmap" ? 0 : 0.7,
        });

        const colors = country.fields?.immutable?.color;
        // Set the calculated color only when choropleth else its white
        if (store?.currentMap?.mapType == "choroplethmap") {
            layer.setStyle({
                fillColor:
                    store.byFeature == null
                        ? "#007dff"
                        : getColor(
                              country?.fields?.mutable[store.byFeature],
                              min,
                              max,
                              colors?.colorA,
                              colors?.colorB
                          ),
            });
        }
        // Control the styling when selecting a certain feature(area)

        if (isPicking) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
            });
        }
        layer.on({
            click: toggleSelection,
        });
    };

    // When hover
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: "#666",
            dashArray: "",
            fillOpacity: 0.7,
        });

        layer.bringToFront();
    }

    //When unhover
    function resetHighlight(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: store?.currentMap?.mapType == "heatmap" ? 0 : 0.7,
        });

        // geolayer.current.resetStyle(e.target);
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
                    color: "white",
                    fillOpacity:
                        store?.currentMap?.mapType == "heatmap" ? 0 : 0.7,
                });
                otherLayer.bringToBack();
            }
        });


        if (!isLayerSelected) {
            // Revert to original style
            layer.setStyle({
                weight: 2,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: store?.currentMap?.mapType == "heatmap" ? 0 : 0.7,
            });
            layer.bringToBack();
            store.setCurrentArea(-1);
        } else {
            // Set the selected style
            layer.setStyle({
                weight: 5,
                color: "#666",
                dashArray: "",
                fillOpacity: store?.currentMap?.mapType == "heatmap" ? 0 : 0.7,
            });
            store.setCurrentArea(layerIndex);
        }

        if (store.isPickingDFM) {
            store.setCurrentArea(layerIndex);
        }
    };

    const getColor = (d, min, max, color1 = "#FFEDA0", color2 = "#800026") => {
        if (min == max) return color1;
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
            const value = parseInt(feature?.fields?.mutable[store.byFeature], 10);
            if (value !== undefined && !isNaN(value)) {
                if (value < min) {
                    min = value;
                }
                if (value > max) {
                    max = value;
                }
            }
        });

        return { min, max };
    };

    // Called in Choropleth Map Only
    const setupGeoJSONLayer = (geoData, isPicking = false) => {
        if (map.current && geolayer.current) {
            // Remove the existing GeoJSON layer
            geolayer.current.clearLayers();

            // Create and add the new GeoJSON layer
            const newGeo = L.geoJson(geoData, {
                onEachFeature: (feature, layer) =>
                    onEachFeature(feature, layer, isPicking),
            }).addTo(map.current);

            // Update the geolayer ref
            geolayer.current = newGeo;
            geolayer.current.bringToBack();
        }
    };

    const setupHeatMapLayer = () => {
        //preliminary checking
        const radius = Number(
            store.geojson.features[0]?.fields?.immutable?.radius
        );
        console.log(radius);
        if (isNaN(radius) || !store.byFeature) {
            return;
        }
        const cfg = {
            radius: radius,
            maxOpacity: 0.8,
            scaleRadius: true,
            useLocalExtrema: true,
            latField: "lat",
            lngField: "lng",
            valueField: "count",
        };

        if (map.current && heatmap.current) {
            map.current.removeLayer(heatmap.current);
        }

        // Create and add the HeatmapOverlay
        const heatmapLayer = new HeatmapOverlay(cfg).addTo(map.current);
        heatmap.current = heatmapLayer;
        // Extract heatmap data from store.geojson
        const heatmapLayerData = store.geojson.features.reduce(
            (acc, feature) => {
                // Check if the intensity value is available and not NaN
                const intensity = feature?.fields?.mutable[store.byFeature]
                    ? parseInt(feature.fields.mutable[store.byFeature], 10)
                    : NaN;

                // Only push if intensity is a valid number
                if (!isNaN(intensity)) {
                    acc.push({
                        lat: feature.fields.immutable.center.latitude,
                        lng: feature.fields.immutable.center.longitude,
                        count: intensity,
                    });
                }
                return acc;
            },
            []
        );

        heatmapLayer.setData({ data: heatmapLayerData });
        // heatmapLayer._el.style.zIndex = 700;
    };

    const setupPointMapLayer = () => {
        //preliminary checking
        const radius = Number(
            store.geojson.features[0]?.fields?.immutable?.radius
        );
        if (isNaN(radius)) {
            return;
        }

        const hexColorPattern = /^#(?:[0-9a-fA-F]{3}){1,2}(?:[0-9a-fA-F]{2})?$/;
        const color1 =
            store.geojson.features[0]?.fields?.immutable?.color?.colorA;
        const color2 =
            store.geojson.features[0]?.fields?.immutable?.color?.colorB;
        console.log(color1, color2)
            if (!hexColorPattern.test(color1) && !hexColorPattern.test(color2)) {
            
            return;
        }

        if (map.current) {
            // Remove existing circles if any
            map.current.eachLayer((layer) => {
                if (layer instanceof L.Circle) {
                    map.current.removeLayer(layer);
                }
            });
        }

        // Extract circle data from store.geojson
        store.geojson.features.forEach((feature) => {
            const count = feature?.fields.mutable[store.byFeature]
                ? parseInt(feature.fields.mutable[store.byFeature], 10)
                : NaN;

            // Only proceed if count is a valid number
            if (!isNaN(count)) {
                // Create and add circle marker
                const circle = L.circle(
                    [
                        feature.fields.immutable.center.latitude,
                        feature.fields.immutable.center.longitude,
                    ],
                    {
                        radius: Math.min(Math.max(count * radius, 0), 1800000), // Adjust the radius based on the count
                        fillColor: feature.fields.immutable.color.colorA, // Customize the fill color
                        fillOpacity: 0.8,
                        color: feature.fields.immutable.color.colorB,
                        weight: 1,
                    }
                ).addTo(map.current);
                // circle.bringToFront();

                // You can add additional customization for the circles if needed
            }
        });
    };

    const setup3D = () => {
        // Preliminary checking
        const scale = Number(
            store.geojson.features[0]?.fields?.immutable?.scale
        );
        if (isNaN(scale)) {
            return;
        }

        const hexColorPattern = /^#(?:[0-9a-fA-F]{3}){1,2}(?:[0-9a-fA-F]{2})?$/;
        const color1 =
            store.geojson.features[0]?.fields?.immutable?.color?.colorA;
        const color2 =
            store.geojson.features[0]?.fields?.immutable?.color?.colorB;
        if (!hexColorPattern.test(color1) && !hexColorPattern.test(color2)) {
            return;
        }
        const color = tinycolor(color1);

        const shade1 = color.darken(0).toString();
        const shade2 = color.darken(10).toString();
        const shade3 = color.darken(20).toString();

        if (map.current) {
            // Remove existing icon markers if any
            map.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    map.current.removeLayer(layer);
                }
            });
        }

        // Extract cube data from store.geojson
        store.geojson.features.forEach((feature) => {
            // Check if the count value is available and not NaN
            const count = feature?.fields?.mutable[store.byFeature]
                ? parseInt(feature.fields.mutable[store.byFeature], 10)
                : NaN;

            // Only proceed if count is a valid number
            if (!isNaN(count)) {
                // Create and add cube marker

                // const cubeSize = 50; // Adjust the size as needed
                const marker = L.marker(
                    [
                        feature.fields.immutable.center.latitude,
                        feature.fields.immutable.center.longitude,
                    ],
                    {
                        icon: createCubeIcon(
                            scale,
                            count,
                            shade1,
                            shade2,
                            shade3,
                            color2
                        ),
                    }
                ).addTo(map.current);
            }
        });
    };


    const setupDFM = () => {
        if (map.current) {
            // Remove existing icon markers that are not in geolayer.current
            map.current.eachLayer((layer) => {
                if (layer instanceof L.Polyline && !geolayer.current.hasLayer(layer)) {
                    map.current.removeLayer(layer);
                }
            });
        }
    
        store.geojson.features.forEach((feature) => {
            if (!feature?.fields?.mutable) {
                return;
            }
            const center = [
                
                feature?.fields?.immutable?.center?.latitude,
                feature?.fields?.immutable?.center?.longitude,
            ];
    
            Object.entries(feature?.fields?.mutable).forEach(([key, value]) => {
                const match = key.match(/^(\d+)_(.+)/);
                if (match) {
                    // Extract relevant information from the matched key
                    const [, country_index, ] = match;
                    const target_country =
                        store.geojson.features[country_index]?.fields?.immutable;
                    if (target_country) {
                        const target_center = [
                            
                            target_country.center.latitude,
                            target_country.center.longitude,
                        ];
                        const count = value ? parseInt(value, 10) : NaN;
    
                        // Create polyline based on extracted information
                        let polyline = L.polyline([center, target_center], {
                            color: "red",
                            weight: count,
                            opacity: 0.5,
                            smoothFactor: 1,
                        }).addTo(map.current);
                    }
                }
            });
        });
    };

    function createCubeIcon(
        cubeSize,
        numCubes,
        shade1,
        shade2,
        shade3,
        borderColor
    ) {
        let iconHtml = "<div class='container'>";

        for (let i = 0; i < numCubes; i++) {
            // Calculate the offset for the right face

            // Add inline styles for each left and right face
            iconHtml += `
                <div class='left' style="transform: translateY(-${
                    i * 100
                }%) rotate(90deg) skewX(-30deg) scaleY(0.864); background-color: ${shade2}; border: 1px solid ${borderColor};"></div>
                <div class='right' style="transform: translateY(-${
                    i * 100
                }%) rotate(-30deg) skewX(-30deg) scaleY(0.864); background-color: ${shade3}; border: 1px solid ${borderColor};"></div>
            `;
        }

        // Add the common top face
        iconHtml += `<div class='top' style='bottom: ${
            numCubes * 200
        }%; background-color: ${shade1}; border: 1px solid ${borderColor};'></div>`;
        iconHtml += "</div>";

        return L.divIcon({
            className: "custom-icon",
            html: iconHtml,
            iconSize: [cubeSize, cubeSize],
            iconAnchor: [0, cubeSize * numCubes],
        });
    }

    const updateMap = () => {
        setupGeoJSONLayer(data, store.isPickingDFM);
        // Possible map templates: 'heatmap', 'distributiveflowmap', 'pointmap', 'choroplethmap', '3drectangle'
        if (store?.currentMap?.mapType === "heatmap") {
            setupHeatMapLayer();
        } else if (store?.currentMap?.mapType === "pointmap") {
            setupPointMapLayer();
        } else if (store?.currentMap?.mapType === "distributiveflowmap") {
            setupDFM();
        } else if (store?.currentMap?.mapType === "3drectangle") {
            setup3D();
        }
    }


    useEffect(() => {
        // Initialize the Leaflet map and store its reference in the map ref
        const mapInstance = L.map("map")
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

        // Create and add the GeoJSON layer
        const geo = L.geoJson(data, {
            onEachFeature: onEachFeature,
        }).addTo(mapInstance);
        // geo.bringToBack()

        geolayer.current = geo;

        updateMap()

        // Cleanup function to remove the map and associated layers when the component is unmounted
        return () => {
            mapInstance.remove();
        };
    }, []);

    // Use another useEffect to set the view after the initial render
    useEffect(() => {
        // Calcluate the min and max
        updateMap()
    }, [data, store.isPickingDFM, store.byFeature]);

    useEffect(() => {
        setupGeoJSONLayer(data);
        if (map.current && map.current.getBoundsZoom && geolayer.current) {
            // Set the view of the map to fit the GeoJSON bounds
            const geoBounds = geolayer.current.getBounds();
            map.current.setView(
                geoBounds.getCenter(),
                map.current.getBoundsZoom(geoBounds) + 1
            );
        }
    }, [store.currentMap]);

    return <div id="map" style={{ height: "100vh" }}></div>;
}

export default NavJSON;
