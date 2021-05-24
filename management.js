let access_url = "http://127.0.0.1:8000/";
let api_url = "http://127.0.0.1:8000/api/v1/";
let httpRequest =
	new XMLHttpRequest();
    let users_endpoint = "users";

function onLoad(){
    request(api_url, users_endpoint, getUsersResponse, 'GET',undefined);
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

function getUsersResponse(){
    switch(this.status){
        case 200: successGetUsers(this.response.users);
        break;
        default: alert(this.response.message);
    }
}

function successGetUsers(usersList){
    usersList.forEach((item) => {
        showData(item.user);
    });
}

function showData(user){
    let body = document.getElementById('table_body');

    var tr = document.createElement('tr');
    var th =  document.createElement('th');
    th.setAttribute('scope', 'row');
    th.innerHTML = user.id;
    var tdUserName = document.createElement('td');
    tdUserName.innerHTML = user.username;
    var tdEmail = document.createElement('td');
    tdEmail.innerHTML = user.email;

    var tdOptions = document.createElement('td');
    tdOptions.setAttribute('colspan', '2');
    var divMain = document.createElement('div');
    divMain.classList.toggle('form-outline');
    divMain.classList.toggle('mb-4');

    var divReader = document.createElement('div');
    divReader.classList.toggle('form-check');
    var inputReader = document.createElement('input');
    inputReader.classList.toggle('form-check-input');
    inputReader.setAttribute('type', 'checkbox');
    inputReader.setAttribute('name', 'reader');
    inputReader.setAttribute('value', user.id);
    var labelReader = document.createElement('label');
    labelReader.classList.toggle('form-check-label');
    labelReader.setAttribute('for', 'flexCheckDefault');
    labelReader.innerHTML = 'Reader';
    if(user.role.includes('reader')){
        inputReader.setAttribute('checked', true);
    }

    var divWriter = document.createElement('div');
    divWriter.classList.toggle('form-check');
    var inputWriter = document.createElement('input');
    inputWriter.classList.toggle('form-check-input');
    inputWriter.setAttribute('type', 'checkbox');
    inputWriter.setAttribute('name', 'reader');
    inputWriter.setAttribute('value', user.id);
    if(user.role.includes('writer')){
        inputWriter.setAttribute('checked', true);
    }
    var labelWriter = document.createElement('label');
    labelWriter.classList.toggle('form-check-label');
    labelWriter.setAttribute('for', 'flexCheckDefault');
    labelWriter.innerHTML = 'Reader';
    

    divWriter.appendChild(labelWriter);
    divWriter.appendChild(inputWriter);
    divReader.appendChild(labelReader);
    divReader.appendChild(inputReader);
    divMain.appendChild(divWriter);
    divMain.appendChild(divReader);
    tdOptions.appendChild(divMain);
    tr.appendChild(th);
    tr.appendChild(tdUserName);
    tr.appendChild(tdEmail);
    tr.appendChild(tdOptions);
    body.appendChild(tr);
}