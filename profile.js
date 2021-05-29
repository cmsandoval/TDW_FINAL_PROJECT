let api_url = "http://127.0.0.1:8000/api/v1/users/";
let httpRequest =
	new XMLHttpRequest();
let userLogged;
let etag;
let jwt;

function onLoad(){
    jwt = window.localStorage.getItem("jwt");
    fetchProfile();
    document.getElementById('btn_update').addEventListener('click', updateProfile);
}

function fetchProfile(){
userLogged = JSON.parse(window.localStorage.getItem("userLogged"));
request(api_url, userLogged.id, successFetchProfile, "GET", undefined);
}

function updateProfile(){
    let user = {        
        'username': document.getElementById('input_name').value,
        'email': document.getElementById('input_email').value,
        'password': document.getElementById('input_password').value,
        'birthdate':  document.getElementById('input_birthdate').value
    };
    updateAPIService(user);
}

function updateAPIService(user){
    fetch(api_url + userLogged.id, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': "Bearer " + jwt,
            'If-Match': etag,
            'Sec-Fetch-Mode': 'cors'
        }
    }).then(res => successUpdateProfile())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
}

function successUpdateProfile(){
    alert('profile updated');
    window.location.reload();
}

function successFetchProfile(){
    let user = httpRequest.response.user;
    etag = httpRequest.getResponseHeader('ETag')
    console.log(etag);
    document.getElementById('name_placeholder').innerHTML = user.username + " id: " + user.id;
    document.getElementById('email_placeholder').innerHTML = user.email;
    document.getElementById('input_name').value = user.username;
    document.getElementById('input_email').value = user.email;
    document.getElementById('input_password').value = userLogged.pass;
    if(user.birthdate != null){
        document.getElementById('input_birthdate').value = user.birthdate;
    }


}

function request(url, endpoint, response, method, params) {
	httpRequest.open(method, encodeURI(url + endpoint), true);
	httpRequest.responseType = "json";
	httpRequest.onload = response;
	let jwt = window.localStorage.getItem("jwt");
	if (jwt != null) {
		httpRequest.setRequestHeader('Authorization', "Bearer " + jwt);
	}
    if(etag != undefined){
        httpRequest.setRequestHeader('If-Match', etag);
    }
	if (params === undefined) {
		httpRequest.send();
	} else {
		httpRequest.send(params);
	}
}