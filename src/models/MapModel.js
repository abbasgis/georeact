import React from "react";
import View from "ol/View";
import Map from "ol/Map";
import {getCenter} from "ol/extent";
import {defaults as defaultControls} from "ol/control/util";
import {ZoomToExtent} from "ol/control";
import LayerSwitcher from "ol-layerswitcher/src/ol-layerswitcher";
import TileLayer from "ol/layer/Tile";
import BingMaps from "ol/source/BingMaps";
import OSM from "ol/source/OSM";
import Stamen from "ol/source/Stamen";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {Fill, Stroke, Style} from "ol/style";
import OLCesium from "olcs/OLCesium.js";
import Cesium from 'cesium/Cesium';
import Geocoder from "ol-geocoder";
import Popup from "ol-popup/src/ol-popup";
import {transform} from "ol/proj";
import $ from "jquery";
window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
require('cesium/Widgets/widgets.css');
require('ol-geocoder/dist/ol-geocoder.min.css');
require('ol-popup/src/ol-popup.css');


class MapModel {
    view = null;
    map = null;
    ol3d = null;
    props = {};
    constructor(props){
        // this.props["extent"] = extent;
        // this.props["zoomLevel"] = zoomLevel;
        this.props = props;
    }
    toggle3D(enable3D) {
        // this.props.enable3D = enable3D;
        this.ol3d.setEnabled(enable3D);
    }
    createView(){
        this.view = new View({
            center: getCenter(this.props.extent),
            extent: this.props.extent,
            zoom: this.props.zoomLevel
        });
    }
    createMap() {
        const bingMapKey = 'nIpvP3DE4KDIPD5rbvf8~tYqmHfqtK9FrpulnwqB6Ow~AlfsQeqqd1RiQqE5rzdQnrgwjgawr26TNXWuLLIrlyMRj2JEp_IhUATReKhb4rCt';
        this.createView();
        this.map = new Map({
            controls: defaultControls().extend([
                new ZoomToExtent({
                    extent: this.props.extent,
                }),
                new LayerSwitcher({
                    tipLabel: 'Legend' // Optional label for button
                })
            ]),
            layers: [
                new TileLayer({
                    title: 'Bing Map - Arial',
                    type: 'base',
                    visible: true,
                    source: new BingMaps({
                        key: bingMapKey,
                        imagerySet: 'AerialWithLabels',
                        // use maxZoom 19 to see stretched tiles instead of the BingMaps
                        // "no photos at this zoom level" tiles
                        // maxZoom: 19

                    })
                }),
                new TileLayer({
                    title: 'OSM',
                    type: 'base',
                    visible: false,
                    source: new OSM()
                }),
                new TileLayer({
                    title: 'Water color',
                    type: 'base',
                    visible: false,
                    source: new Stamen({
                        layer: 'watercolor'
                    })
                }),
                new VectorLayer({
                    title: "Weather Info layer",
                    source: new VectorSource({
                        features: []
                    }),
                    style: new Style({
                        stroke: new Stroke({
                            color: '#aa000b',
                            width: 1
                        }),
                        fill: new Fill({
                            color: 'rgba(255,0,0,0.3)'
                        }),
                    })
                })
            ],
            target: 'map',
            view: this.view,

        });
        this.geocoder = new Geocoder('nominatim', {
            provider: 'osm',
            lang: 'en',
            placeholder: 'Search for ...',
            limit: 5,
            debug: false,
            autoComplete: true,
            keepOpen: true
        });
        this.map.addControl(this.geocoder);
        let popup = new Popup();
        this.map.addOverlay(popup);
        this.geocoder.on('addresschosen', function (evt) {
            window.setTimeout(function () {
                // geocoder.getLayer().getSource().clear();
                let pnt = transform([evt.coordinate[0], evt.coordinate[1]], 'EPSG:3857', 'EPSG:4326');
                getWeatherData(pnt[1], pnt[0], evt);
            }, 3000);
        });

        function getWeatherData(lat, long, evt) {
            $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&units=metric&APPID=8aaba049f13af03ca4ad9c10672b391a',
                dataType: 'application/json',
                complete: function (data) {
                    let d = JSON.parse(data.responseText);
                    let table = '<table>';
                    for (let k in d) {
                        if (k === 'weather') {
                            let tr = '<tr><td>Weather</td><td>' + d[k][0].description + '</td></tr>';
                            table = table + tr;
                        }
                        if (k === 'main') {
                            for (let key in d[k]) {
                                let tr = '<tr><td>' + key + '</td>';
                                if (key.indexOf("temp") !== -1) {
                                    tr = tr + '<td>' + d[k][key] + ' &deg;C</td></tr>';

                                } else {
                                    tr = tr + '<td>' + d[k][key] + '</td></tr>';
                                }
                                table = table + tr;
                            }

                        }
                        if (k === 'wind') {
                            let tr = '<tr><td>Wind Speed</td><td>' + d[k].speed + ' m/s</td></tr>';
                            table = table + tr;
                        }
                    }
                    table = table + '</table>';
                    popup.show(evt.coordinate, table);
                }
            })
        }
        this.create3DMap();
    }
    create3DMap(){
        this.ol3d = new OLCesium({map: this.map}); // ol2dMap is the ol.Map instance
        this.ol3d.setEnabled(this.props.enable3D);
    }
}

export default MapModel;