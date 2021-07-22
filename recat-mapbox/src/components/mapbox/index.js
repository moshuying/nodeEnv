import React, {useRef, useEffect, useState} from 'react';
import mapboxgl, {Map} from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css'
// import style from './style/style.json'

/**
 * import Mapbox GL and add your access token.
 * To use Mapbox GL with Create React App,
 * you must add an exclamation point to exclude mapbox-gl from transpilation
 * and disable the eslint rule import/no-webpack-loader-syntax.
 * Set the mapboxgl accessToken property to the value of your Mapbox access token:
 */
mapboxgl.accessToken = 'pk.eyJ1IjoibW9zaHV5aW5nIiwiYSI6ImNrYzJ3d3p1MjA0N3kyd3RnZXFpejlrZ3UifQ.8BVZUdzrBZqO7i5tVqbiUw';

export default function App() {

    /**
     * will create some defaults for your app to use for the initial latitude, longitude,
     * and zoom of the map. Add the following inside App:
     */
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
    /**
     * initialize the map.
     * The following code will be invoked right after the app is inserted
     * into the DOM tree of your HTML page.
     */
    useEffect(() => {
        if (map.current) return; // initialize map only once
        const style = {
            "version": 8,
            "sources": {
                "raster-tiles": {
                    "type": "raster",
                    'tiles': [
                        // wprd0{1-4}
                        // scl=1&style=7 为矢量图（含路网和注记）
                        // scl=2&style=7 为矢量图（含路网但不含注记）
                        // scl=1&style=6 为影像底图（不含路网，不含注记）
                        // scl=2&style=6 为影像底图（不含路网、不含注记）
                        // scl=1&style=8 为影像路图（含路网，含注记）
                        // scl=2&style=8 为影像路网（含路网，不含注记）
                        "http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7"
                    ],
                    "tileSize": 256
                }
            },
            "layers": [{
                "id": "simple-tiles",
                "type": "raster",
                "source": "raster-tiles",
                "minzoom": 0,
                // "maxzoom": 18
            }]
        }
        map.current = new Map({
            container: mapContainer.current,
            style: style,
            center: [lng, lat],
            zoom: zoom
        });
        map.current.on('style.load', () => {
            // eslint-disable-next-line no-undef
            // const GaoDe = new AMap.TileLayer()
            // console.log(GaoDe)
            // const layer =  {
            //     "id": "rivers",
            //     "type": "line",
            //     "source": "mapbox://mapbox.mapbox-streets-v8",
            //     "source-layer": "waterway",
            //     "paint": {"line-color": "#ffc0cb"}
            // }
            // map.current.addLayer(layer, 'gaode')
        })

    });
    // Render the map
    return (
        <div>
            <div ref={mapContainer} className="map-container"/>
        </div>
    );
}
