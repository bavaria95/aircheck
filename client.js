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

    display_user_symptoms();
    get_list_of_areas();
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

    var data = {'symptom_id': form['symptom-id'].value,
        'timestamp_start': form['time-start'].value,
        'timestamp_end': form['time-end'].value,
        'latitude': form['latitude'].value,
        'longitude': form['longitude'].value,
        'typeofarea': form['typeofarea-id'].value,
        'token': get_token()};

    console.log(data);
    ajax_call("POST", "/symptom", display_user_symptoms, data);
}
display_user_symptoms = function() {
    ajax_call("GET", "/symptom?token="+get_token(), fill_in_user_symptoms);
    get_list_of_symptoms();
}
fill_in_user_symptoms = function(symptoms) {
    document.getElementById("symptoms-list").innerHTML = '';

    for (var i = 0; i < symptoms.length; i++) {
        var new_li = document.createElement("li");

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


show_profile = function(data) {
    document.getElementById('search-content').style = "display: none;";
    document.getElementById('profile-unfam').style = "display: block;";
    // fill_user_info_fields('browse', data);
}
