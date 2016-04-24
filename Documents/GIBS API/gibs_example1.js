/**
 * GIBS Web Examples
 *
 * Copyright 2013 - 2014 United States Government as represented by the
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var toggleCO2;

window.onload = function() {

    var source = new ol.source.MapQuest({layer: 'sat'})

    var osm_source = new ol.source.OSM();

    var source2 = new ol.source.WMTS({
        url: "//map1{a-c}.vis.earthdata.nasa.gov/wmts-geo/",
        layer: "VIIRS_CityLights_2012",
        style:"default",
        time: "2015-09-17",
        tilematrixSet: "EPSG4326_500m",
        tilematrix: 12,
        tilerow:"6",
        tilecol:"6",
        format: "image/jpeg",

       // service: "OGC WMTS",


        tileGrid: new ol.tilegrid.WMTS({
            origin: [-180, 90],
            resolutions: [
                0.5625,
                0.28125,
                0.140625,
                0.0703125,
                0.03515625,
                0.017578125
                // 0.0087890625,
                // 0.00439453125,
                // 0.002197265625
            ],
            matrixIds: [0, 1, 2, 3, 4, 5],
            tileSize: 512
        })
    });

    // var features = new Array(3);
    //
    // function toFeature(lat,lon){
    //     var stuff = ol.proj.transform([lon,lat], 'EPSG:4326', 'EPSG:3857');
    //     console.log('Le stuff', stuff);
    //     console.log('Le point', new ol.geom.Point(stuff));
    //     return new ol.Feature(new ol.geom.Point(stuff));
    // }

    // features[0] = toFeature(50.061389, 19.938333)
    // features[1] = toFeature(58.4, 15.616667);
    // features[2] = toFeature(-27.166667, -109.416667);

    var count = 20000;
    var features2 = new Array(count);
    var e = 4500000;
    for (var i = 0; i < count; ++i) {
        var coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
        features2[i] = new ol.Feature(new ol.geom.Point(coordinates));
    }


    console.log(ol.proj.transform([50.061389, 19.938333], 'EPSG:4326', 'EPSG:3857'));
    console.log(features2[0]);

    var sourceVec = new ol.source.Vector({
        features: features2
    });

    var clusterSource = new ol.source.Cluster({
        distance: 40,
        source: sourceVec
    });


    var styleCache = {};
    var clusters = new ol.layer.Vector({
        source: clusterSource,
        style: function(feature) {
            var size = feature.get('features').length;
            console.log("Size",size);
            var style = styleCache[size];
            if (!style) {
                style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 10,
                        stroke: new ol.style.Stroke({
                            color: '#fff'
                        }),
                        fill: new ol.style.Fill({
                            color: '#3399CC'
                        })
                    }),
                    text: new ol.style.Text({
                        text: size.toString(),
                        fill: new ol.style.Fill({
                            color: '#fff'
                        })
                    })
                });
                styleCache[size] = style;
            }
            return style;
        }
    });

    var layer = new ol.layer.Tile({
        source: source
    });
    var layer2 = new ol.layer.Tile({
        source: source2,
        opacity: 0.55
    });

    var layer3 = new ol.layer.Tile({
        source: osm_source,
        opacity: 1
    });



    // map.addLayer(layer);
    // // map.addLayer(layer3);
    // map.addLayer(layer2);
    // map.addLayer(clusters);

    var map = new ol.Map({
        layers: [layer,layer2,clusters],
        view: new ol.View({
            // maxResolution: 0.5625,
            projection: ol.proj.get("EPSG:4326"),
            extent: [-180, -90, 180, 90],
            center: [0, 0],
            zoom: 2
        }),
        target: "map",
        renderer: ["canvas", "dom"]
    });

    toggleCO2 = function(){
        layer2.setVisible(!layer2.getVisible());
    }


    map.getView().on('change:resolution', function(){
        var zoom = map.getView().getZoom();
        // console.log("whee", map.getView().getZoom())

        var zoom_capped = Math.min(14,Math.max(zoom,8)) - 8;
        var opacity_val = (1-((zoom_capped)/6.0)) * 0.55;

        layer2.setOpacity(opacity_val);
        // console.log(layer2.getOpacity());
    })
};
