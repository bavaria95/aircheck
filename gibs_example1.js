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

function rgb(r, g, b){
    return "rgb("+r+","+g+","+b+")";
}

function loadMap() {

    var source = new ol.source.MapQuest({layer: 'sat'})

    var osm_source = new ol.source.OSM();



    var features = new Array(3);

    function toFeature(lat,lon){
        return new ol.Feature(new ol.geom.Point([lon,lat]));
    }


    features[0] = toFeature(50.061389, 19.938333)

    features[1] = toFeature(58.4, 15.616667);
    features[2] = toFeature(-27.166667, -109.416667);

    function randomlyAdd(lat,lon,radius,count) {
        var new_features = new Array(count);
        for (i = 0; i < count; i++) {
            var offset_lat = -radius + (Math.random() * 2 * radius);
            var offset_lon = -radius + (Math.random() * 2 * radius);
            var smth = toFeature(lat + offset_lat, lon + offset_lon)
            // console.log("The offsets", i, offset_lat, offset_lon)
            // console.log("The ith element", i, lat + offset_lat, lon + offset_lon)
            features.push(smth)
            // new_features[i] = smth;
        }
        features.concat(new_features)
        // console.log("The size..", new_features.length)
        // console.log("The size?", features.length)
    }


    randomlyAdd(58.4, 15.616667, 0.15, 93)
    randomlyAdd(50.061389, 19.938333, 0.15, 26)
    // randomlyAdd(features[1][0], features[1][1], 0.15, 1)
    console.log("The size!", features.length)


    console.log(ol.proj.transform([50.061389, 19.938333], 'EPSG:4326', 'EPSG:3857'));
    var sourceVec = new ol.source.Vector({
        features: features
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
            // console.log("Size",size);
            var style = styleCache[size];
            var r_component = Math.min(size,100);
            var r_normalized = r_component/100.0;
            // console.log("r_normalized", r_normalized)
            var color = rgb(180 * r_normalized,(1 - r_normalized)*180,20);
            var text = 'CO';
            if (size > 1){
                text = text + '\n' + size.toString()
            }
            if (!style) {
                style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 15 + (20*r_normalized),
                        stroke: new ol.style.Stroke({
                            color: '#fff'
                        }),
                        fill: new ol.style.Fill({
                            color: '#776666'
                            // color: '#3399CC'
                            // color: color
                        })
                    }),
                    text: new ol.style.Text({
                        text: text,
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

    // var source2 = new ol.source.WMTS({
    //     url: "//map1{a-c}.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?TIME=2015-06-16",
    //     layer: "SMAP_L4_Mean_Gross_Primary_Productivity",
    //     format: "image/png",
    //     matrixSet: "EPSG4326_2km",
    //     service: "OGC WMTS",
    //
    //     tileGrid: new ol.tilegrid.WMTS({
    //         origin: [-180, 90],
    //         resolutions: [
    //             0.5625,
    //             0.28125,
    //             0.140625,
    //             0.0703125,
    //             0.03515625,
    //             0.017578125,
    //             0.0087890625,
    //             0.00439453125,
    //             0.002197265625
    //         ],
    //         matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    //         tileSize: 512
    //     })
    // });

    var source2 = new ol.source.WMTS({
        url: "//map1{a-c}.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?TIME=2015-06-16",
        layer: "AIRS_CO_Total_Column_Day",
        format: "image/png",
        matrixSet: "EPSG4326_2km",
        service: "OGC WMTS",
        tileGrid: new ol.tilegrid.WMTS({
            origin: [-180, 90],
            resolutions: [
                0.5625,
                0.28125,
                0.140625,
                0.0703125,
                0.03515625,
                0.017578125,
                0.0087890625,
                0.00439453125,
                0.002197265625
            ],
            matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            tileSize: 512
        })
    });

    var layer2 = new ol.layer.Tile({
        source: source2,
        opacity: 0.3
    });



    var layer3 = new ol.layer.Tile({
        source: osm_source,
        opacity: 1
    });


    var map = new ol.Map({
        layers: [layer3, layer2, clusters],
        renderer: ['canvas','dom'],
        target: 'map',
        view: new ol.View({
            projection: ol.proj.get("EPSG:4326"),
            extent: [-180, -90, 180, 90],
            center: [0, 0],
            zoom: 2
        })
    });

    toggleCO2 = function(){
        layer2.setVisible(!layer2.getVisible());
        console.log("Happy debuggin'!", layer2.getVisible(), layer2.getOpacity())
    }


    map.getView().on('change:resolution', function(){
        var zoom = map.getView().getZoom();
        // console.log("whee", map.getView().getZoom())

        var zoom_capped = Math.min(14,Math.max(zoom,8)) - 8;
        var opacity_val = (1-((zoom_capped)/6.0)) * 0.4;

        layer2.setOpacity(opacity_val);
    })
};
