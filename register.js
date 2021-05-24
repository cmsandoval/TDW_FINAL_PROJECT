let currentUser;
let api_url = "http://127.0.0.1:8000/api/v1/";
let users_endpoint = "users";

let httpRequest =
	new XMLHttpRequest();

function onLoad() {
getCurrentUser();
document.getElementById('register_btn').addEventListener('click', requestRegistration);

}

function getCurrentUser(){
   currentUser = JSON.parse(window.localStorage.getItem("register"));
   document.getElementById('input_password').value = currentUser.password;
   document.getElementById('input_username').value = currentUser.username;
   document.getElementById('input_reader').checked = true; 
}

function requestRegistration(){
    let form = new FormData();
    let inputPassword = document.getElementById('input_password').value;
    let inputEmail = document.getElementById('input_email').value;
    let role;
    if(document.getElementById('input_reader').checked &&
    document.getElementById('input_writer').checked){
        role = 'reader writer';
    } else if(document.getElementById('input_writer').checked){
        role = 'writer';
    } else if(document.getElementById('input_reader').checked){
        role = 'reader';
    }

    form.append('username', currentUser.username);
    form.append('password', inputPassword);
    form.append('email', inputEmail);
    form.append('role', role);

    request(api_url,users_endpoint, registerResponse, 'POST', form);
}

function request(url, endpoint, response, method, params) {
	httpRequest.open(method, encodeURI(url + endpoint), true);
	httpRequest.responseType = "json";
	httpRequest.onload = response;
	let jwt = window.localStorage.getItem("jwt");
	if (jwt != null) {
		httpRequest.setRequestHeader('Authorization', "Bearer " + jwt);
	}
	if (params === undefined) {
		httpRequest.send();
	} else {
		httpRequest.send(params);
	}
}

function registerResponse(){
    switch(httpRequest.status){
		case 201:  successRegistration();
		break;
		case 400: alert('User name or e-mail already exists, or role does not exist');
		break;
        case 401: alert('UNAUTHORIZED: invalid Authorization header');
        break;
        case 403: alert('You do not have permission to access');
        break;
        case 422: alert('name, e-mail or password is left out');
        break;
	}
}

function successRegistration(){
    alert("User registrated");
    window.localStorage.removeItem("register");
    window.location.href = "./practica.html";
}