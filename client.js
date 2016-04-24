var mymap;
var my_marker;

// var loadOL;
var toggleCO2;

loadOL = function(lat, lng) {

    var source = new ol.source.MapQuest({layer: 'sat'})

    var osm_source = new ol.source.OSM();

    var source2 = new ol.source.WMTS({
        url: "//map1{a-c}.vis.earthdata.nasa.gov/wmts-geo/",
        layer: "SMAP_L4_Mean_Gross_Primary_Productivity",
        time: "2015-09-17",
        matrixSet: "EPSG4326_2km",
        format: "image/png",

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

    var features = new Array(1);

    function toFeature(lat,lon){
        return new ol.Feature(new ol.geom.Point([lon,lat]));
    }
    features[0] = toFeature(lat, lng)

    // features[1] = toFeature(58.4, 15.616667);
    // features[2] = toFeature(-27.166667, -109.416667);
    

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


    var map = new ol.Map({
        layers: [layer3, layer2, clusters],
        renderer: ['canvas','dom'],
        target: 'map',
        view: new ol.View({
            projection: ol.proj.get("EPSG:4326"),
            extent: [-180, -90, 180, 90],
            center: [lng, lat],
            zoom: 7
        })
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
    })
};


ajax_call = function(method, path, func, data) {
    url = 'http://127.0.0.1:5000';

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            var resp = JSON.parse(xhttp.responseText);

            func(resp);

            console.log(JSON.parse(xhttp.responseText));
        }
    };

    xhttp.open(method, url + path, true);

    if (method != "GET") {
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(data));
    }
    else
        xhttp.send();
}


window.onload = function(){
    if (localStorage.getItem('token'))
        display_view('profileview');
    else 
        display_view('welcomeview');
}

define_onclick_functions = function() {
    var account_tab = document.getElementById("account-tab");
    account_tab.onclick = function() {
        activate_account();
    }

    var home_tab = document.getElementById("home-tab");
    home_tab.onclick = function() {
        activate_home();
    }

    var browse_tab = document.getElementById("browse-tab");
    browse_tab.onclick = function() {
        activate_browse();
    }

    var signout_button = document.getElementById("sign-out");
    signout_button.onclick = function() {
        signout();
    }

}

display_view = function(view) {
    document.getElementById('view').innerHTML = document.getElementById(view).innerHTML;

    if (view == 'welcomeview')
        document.getElementsByTagName("body")[0].style.background = "#6699ff";
    if (view == 'profileview') {
        define_onclick_functions();
        document.getElementsByTagName("body")[0].style.background = "#FFF";
        activate_account();
    }
}

init_timepicker = function(id) {
    $('#'+id).timepicker({
                minuteStep: 1,
                showMeridian: false,
                defaultTime: false,
    });

    $('#'+id).on('show.timepicker', function(e) {
        var d = new Date;
        var time = d.getHours() + ":" + d.getMinutes();
        $('#'+id).timepicker('setTime', time);
      });
}

init_datepicker = function(id) {
    $('#'+id).datepicker({
        format: "yyyy-mm-dd",
        todayBtn: "linked",
        weekStart: 1,
        clearBtn: true,
        multidate: false,
        forceParse: false,
        toggleActive: true,
        autoclose: true
    });
}

check_reg_correctness = function() {
	var pass1 = document.getElementById("regpass1").value;
    var pass2 = document.getElementById("regpass2").value;
    var status = true;
    var msg = '';

    if (pass1 != pass2) {
    	msg = "Your passwords don't match. Check again";
    	status = false;
    }

    if (pass1.length < 8) {
    	msg = "Make sure password has length at least 8";
    	status = false;
    }

    display_error_msg_reg(msg);

    return status;
}

display_error_msg_reg = function(msg) {
	document.getElementById("error-reg").innerHTML = msg;
}

display_error_msg_log = function(msg) {
	document.getElementById("error-log").innerHTML = msg;
}

login = function(email, password) {
    var data = {'email': email, 'password': password};

    func = function(resp) {
        if (!resp.success) 
            display_error_msg_log(resp.message);
        else {
            localStorage.setItem('token', resp.data);

            display_view('profileview');
            // activate_account();
            activate_home();
        }
    }

    ajax_call("POST", "/sign_in", func, data);
}

login_form = function() {
    var form = document.forms['login-form'];
    var email = form['email'].value;
    var password = form['pass'].value;

    login(email, password); 
}

signup = function() {
	var form = document.forms['signup-form'];
    var data = {
        email: form['email'].value,
        password: form['pass'].value
    };

    // TODO password hash!

    if (check_reg_correctness()) {
        func = function(resp) {
        	if (!resp.success) 
        		display_error_msg_reg(resp.message);
        	else
        		login(data.email, data.password);
        }

        ajax_call("POST", "/sign_up", func, data);
    }
}

signout = function() {
    var data = {'token': get_token()};
    ajax_call("POST", "/sign_out", function(){}, data);

    localStorage.removeItem('token');
    display_view('welcomeview');
}

get_token = function() {
    return localStorage.getItem('token');
}

get_user_info = function() {
    token = get_token();

    /* func = function(resp) {
        return resp.data;
    }

    ajax_call("GET", "/get_user_data_by_token?token="+token, func);
    // return serverstub.getUserDataByToken(token).data;*/

    url = 'http://127.0.0.1:5000';

    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", url + "/get_user_data_by_token?token="+token, false);

    xhttp.send();

    if (xhttp.readyState == 4 && xhttp.status == 200) {

            var resp = JSON.parse(xhttp.responseText);

            return resp.data;

            console.log(JSON.parse(xhttp.responseText));
    }

}

highlight_label = function(label) {
    document.getElementById('account-label').style.fontSize = "100%";
    document.getElementById('home-label').style.fontSize = "100%";
    document.getElementById('browse-label').style.fontSize = "100%";

    document.getElementById(label + '-label').style.fontSize = "120%";

    document.getElementById('account-label').style.fontWeight = "normal";
    document.getElementById('home-label').style.fontWeight = "normal";
    document.getElementById('browse-label').style.fontWeight = "normal";

    document.getElementById(label + '-label').style.fontWeight = "bold";

}

activate_account = function() {
    document.getElementById('account-view').style = "display: block;";
    document.getElementById('home-view').style = "display: none;";
    document.getElementById('browse-view').style = "display: none;";
    highlight_label('account');

    display_user_problems();
}


activate_home = function() {
    document.getElementById('account-view').style = "display: none;";
    document.getElementById('home-view').style = "display: block;";
    document.getElementById('browse-view').style = "display: none;";
    highlight_label('home');

    create_map();
    // loadOL();

    display_user_symptoms();
    get_list_of_areas();

    init_datepicker('start-date');
    init_timepicker('start-time');
    init_datepicker('end-date');
    init_timepicker('end-time');
}


activate_browse = function() {
    document.getElementById('account-view').style = "display: none;";
    document.getElementById('home-view').style = "display: none;";
    document.getElementById('browse-view').style = "display: block;";
    highlight_label('browse');
}


change_password = function() {
    var form = document.forms['pass-change-form'];
    var current = form['current'].value,
        pass1 = form['pass1'].value,
        pass2 = form['pass2'].value

    var error_msg = '';

    if (pass1 != pass2)
        error_msg = "Passwords don't match";

    if (pass1.length < 8)
        error_msg = "Password has to be longer than 8 symbols";

    if (error_msg != '') {
        display_error_msg_change(error_msg);
        return false;
    }

    var data = {'token': get_token(), 'old_password': current, 
                'new_password': pass1};

    func = function(resp) {
        if (!resp.success) {
            document.getElementById('change-error').style.color = "FF0000";
            display_error_msg_change(resp.message);
        }
        else {
            document.getElementById('change-error').style.color = "00FF00";
            display_error_msg_change(resp.message);
            document.getElementById("pass-change-form").reset();
        }
    }

    ajax_call("POST", "/change_password", func, data);
}

fill_in_all_problems = function(problems) {
    document.getElementById("adding-problems").innerHTML = '';

    var new_select = document.createElement("select");
    new_select.setAttribute("id", "dropdown-problems");
    new_select.setAttribute("name", "problem-id");
    new_select.setAttribute("class", "form-control");

    for (var i = 0; i < problems.length; i++) {
        var new_option = document.createElement("option");
        new_option.setAttribute("value", problems[i][0]);

        var text = document.createTextNode(problems[i][1]);
        new_option.appendChild(text);

        new_select.appendChild(new_option);
    }

    document.getElementById("adding-problems").appendChild(new_select);
}
get_list_of_problems = function() {
    ajax_call("GET", "/problems", fill_in_all_problems);
}
add_problem = function() {
    var form = document.forms['adding-problems-form'];
    var problem_id = form['problem-id'].value;
    ajax_call("POST", "/problem", display_user_problems, {'token': get_token(),
                                                          'problem_id': problem_id});
}
display_user_problems = function() {
    ajax_call("GET", "/problem?token="+get_token(), fill_in_user_problems);
    get_list_of_problems();
}
fill_in_user_problems = function(problems) {
    document.getElementById("problems-list").innerHTML = '';

    for (var i = 0; i < problems.length; i++) {
        var new_li = document.createElement("li");
        new_li.setAttribute("class", "list-group-item");

        var text = document.createTextNode(problems[i]);
        new_li.appendChild(text);

        document.getElementById("problems-list").appendChild(new_li);
    }
}


fill_in_all_symptoms = function(symptoms) {
    document.getElementById("adding-symptoms").innerHTML = '';

    var new_select = document.createElement("select");
    new_select.setAttribute("id", "dropdown-symptoms");
    new_select.setAttribute("name", "symptom-id");
    new_select.setAttribute("class", "form-control");

    for (var i = 0; i < symptoms.length; i++) {
        var new_option = document.createElement("option");
        new_option.setAttribute("value", symptoms[i][0]);

        var text = document.createTextNode(symptoms[i][1]);
        new_option.appendChild(text);

        new_select.appendChild(new_option);
    }

    document.getElementById("adding-symptoms").appendChild(new_select);
}
get_list_of_symptoms = function() {
    ajax_call("GET", "/symptoms", fill_in_all_symptoms);
}
add_symptom = function() {
    var form = document.forms['adding-symptoms-form'];

    var mark = my_marker.getLatLng();

    var data = {'symptom_id': form['symptom-id'].value,
                'typeofarea': form['typeofarea-id'].value,
                'token': get_token(),
                'timestamp_start': Date.parse(form['start-date'].value, form['start-time'].value)/1000,
                'latitude': mark['lat'],
                'longitude': mark['lng']
            };

    loadOL(mark['lat'], mark['lng']);


    ajax_call("POST", "/symptom", display_user_symptoms, data);
}
display_user_symptoms = function() {
    ajax_call("GET", "/symptom?token="+get_token(), fill_in_user_symptoms);
    get_list_of_symptoms();
    document.getElementById("adding-symptoms-form").reset();
}
fill_in_user_symptoms = function(symptoms) {
    document.getElementById("symptoms-list").innerHTML = '';

    for (var i = 0; i < symptoms.length; i++) {
        var new_li = document.createElement("li");
        new_li.setAttribute("class", "list-group-item");

        var text = document.createTextNode(symptoms[i]);
        new_li.appendChild(text);

        document.getElementById("symptoms-list").appendChild(new_li);
    }
}



fill_in_all_areas = function(areas) {
    document.getElementById("typeofarea").innerHTML = '';

    var new_select = document.createElement("select");
    new_select.setAttribute("id", "dropdown-typeofarea");
    new_select.setAttribute("name", "typeofarea-id");
    new_select.setAttribute("class", "form-control");

    for (var i = 0; i < areas.length; i++) {
        var new_option = document.createElement("option");
        new_option.setAttribute("value", areas[i][0]);

        var text = document.createTextNode(areas[i][1]);
        new_option.appendChild(text);

        new_select.appendChild(new_option);
    }

    document.getElementById("typeofarea").appendChild(new_select);
}
get_list_of_areas = function() {
    ajax_call("GET", "/areatypes", fill_in_all_areas);
}

display_error_msg_change = function(msg) {
    document.getElementById("change-error").innerHTML = msg;
}

create_map = function() {    
    if (mymap)
        mymap.remove();

    mymap = L.map('mapid').setView([58.3953, 15.5596], 13);
    
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
        maxZoom: 18,
        id: 'mapbox.streets'
    }).addTo(mymap);

    my_marker = L.marker([58.3953, 15.5596]);
    my_marker.addTo(mymap);

    place_marker = function(obj) {
        if (my_marker)
            mymap.removeLayer(my_marker);

        my_marker = L.marker([obj.lat, obj.lng]);
        my_marker.addTo(mymap);

    }


    function onMapClick(e) {
        place_marker(e.latlng);
    }
    mymap.on('click', onMapClick);
}

