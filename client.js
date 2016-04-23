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
            activate_account();
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
}


activate_home = function() {
    document.getElementById('account-view').style = "display: none;";
    document.getElementById('home-view').style = "display: block;";
    document.getElementById('browse-view').style = "display: none;";
    highlight_label('home');

    fill_user_info_fields('home', get_user_info());
    refresh_wall('home');
}
fill_user_info_fields = function(tab, info) {

    document.getElementById(tab + '-email').innerHTML = info.email;
    document.getElementById(tab + '-firstname').innerHTML = info.firstname;
    document.getElementById(tab + '-familyname').innerHTML = info.familyname;
    document.getElementById(tab + '-gender').innerHTML = info.gender;
    document.getElementById(tab + '-city').innerHTML = info.city;
    document.getElementById(tab + '-country').innerHTML = info.country;
}

activate_browse = function() {
    document.getElementById('account-view').style = "display: none;";
    document.getElementById('home-view').style = "display: none;";
    document.getElementById('browse-view').style = "display: block;";
    highlight_label('browse');

    document.getElementById('profile-unfam').style = "display: none;";
    document.getElementById('search-content').style = "display: block;";

    document.getElementById('search-error').innerHTML = '';
    document.getElementById('search-field').value = '';

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

display_error_msg_change = function(msg) {
    document.getElementById("change-error").innerHTML = msg;
}
c

show_profile = function(data) {
    document.getElementById('search-content').style = "display: none;";
    document.getElementById('profile-unfam').style = "display: block;";
    fill_user_info_fields('browse', data);
    refresh_wall('browse', data.email);
}
