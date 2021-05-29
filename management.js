let access_url = "http://127.0.0.1:8000/";
let api_url = "http://127.0.0.1:8000/api/v1/";
let httpRequest =
    new XMLHttpRequest();
let users_endpoint = "users";
let etag;
let userId;

function onLoad() {
    request(api_url, users_endpoint, getUsersResponse, 'GET', undefined);
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

function getUsersResponse() {
    switch (this.status) {
        case 200: successGetUsers(this.response.users);
            break;
        default: alert(this.response.message);
    }
}

function updateUser(role, etag) {
    let jwt = window.localStorage.getItem("jwt");
    
    if (httpRequest.status == 200) {
        if (etag != undefined) {
            fetch(api_url + users_endpoint + "/" + userId, {
                method: 'PUT',
                body: JSON.stringify(role),
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Authorization': "Bearer " + jwt,
                    'If-Match': etag
                }
            }).then(res => successRequest())
                .catch(error => console.error('Error:', error))
                .then(response => console.log('Success:', response));
        }
    }
}

function successRequest() {
    alert("user updated");
    window.location.reload();
}

function getRole(userId) {
    var writer = document.getElementById('writer_' + userId);
    var reader = document.getElementById('reader_' + userId);
    let scope = "";
    var resul;
    if (writer.checked) {
        scope = "writer";
        resul = { role: scope };
    } else if (reader.checked) {
        scope = "reader";
        resul = { role: scope };
    } else {
        alert("Needs to choose one option");
    }
    return resul;
}

function getUserId() {
    userId = this.value;
    let role = getRole(userId);
    if (role !== undefined) {
        getUserIdService(userId, role);
    }
}

function getUserIdService(userId, role){
    let jwt = window.localStorage.getItem("jwt");
    fetch(api_url + users_endpoint + "/" + userId, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': "Bearer " + jwt
        }
    }).then(res =>  updateUser(role, res.headers.get("etag")))
       // updateUser(role, res.response.getResponseHeader('ETag'))
       .then(response => console.log('Success:', response))
        .catch(error => console.error('Error:', error));
}

function successGetUsers(usersList) {
    usersList.forEach((item) => {
        showData(item.user);
        etag = httpRequest.getResponseHeader('ETag');
    });
}

function deleteUser() {
   userId = this.value;
}

function deleteUserFromAPI(){
    request(api_url,users_endpoint+"/"+userId,responseDeleteFromApi, 'DELETE', undefined )
}

function responseDeleteFromApi(){
    switch(httpRequest.status){
        case 204: alert("user deleted");
        window.refere
        break;
        case 401: alert("invalid Authorization header");
        break;
        case 404: alert("resource not found");
        break;
    }
    window.location.reload();
}

function showData(user) {
    let body = document.getElementById('table_body');

    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.setAttribute('scope', 'row');
    th.innerHTML = user.id;

    var tdUserName = document.createElement('td');
    tdUserName.innerHTML = user.username;

    var tdEmail = document.createElement('td');
    tdEmail.innerHTML = user.email;
    //------------
    var tdOptions = document.createElement('td');

    var divMain = document.createElement('div');
    divMain.classList.toggle('form-outline');
    divMain.classList.toggle('mb-4');

    var divReader = document.createElement('div');
    divReader.classList.toggle('form-check');
    var inputReader = document.createElement('input');
    inputReader.classList.toggle('form-check-input');
    inputReader.setAttribute('type', 'checkbox');
    inputReader.setAttribute('name', 'reader');
    inputReader.setAttribute('id', 'reader_' + user.id);
    var labelReader = document.createElement('label');
    labelReader.classList.toggle('form-check-label');
    labelReader.setAttribute('for', 'flexCheckDefault');
    labelReader.innerHTML = 'Reader';
    if (user.role.includes('reader')) {
        inputReader.setAttribute('checked', true);
    }

    var divWriter = document.createElement('div');
    divWriter.classList.toggle('form-check');
    var inputWriter = document.createElement('input');
    inputWriter.classList.toggle('form-check-input');
    inputWriter.setAttribute('type', 'checkbox');
    inputWriter.setAttribute('name', 'writer');
    inputWriter.setAttribute('id', 'writer_' + user.id);
    if (user.role.includes('writer')) {
        inputWriter.setAttribute('checked', true);
    }

    var labelWriter = document.createElement('label');
    labelWriter.classList.toggle('form-check-label');
    labelWriter.setAttribute('for', 'flexCheckDefault');
    labelWriter.innerHTML = 'Writer';
    //--------------

    var tdEditButton = document.createElement('td');
    var buttonEditar = document.createElement("button");
    buttonEditar.setAttribute("type", "button");
    buttonEditar.setAttribute('value', user.id);
    buttonEditar.classList.toggle("btn");
    buttonEditar.classList.toggle("btn-warning");
    buttonEditar.innerHTML = "Update";
    buttonEditar.style.display = 'block';
    buttonEditar.addEventListener('click', getUserId);

    var tdDisableButton = document.createElement('td');
    var divDisable = document.createElement('div');
    divDisable.classList.toggle('form-check');
    divDisable.classList.toggle('form-switch');
    var input = document.createElement('input');
    input.classList.toggle('form-check-input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('value', user.id);
    input.addEventListener('change', switchEvent);
    if(user.active){
        input.setAttribute('checked', true);
    }
    var label = document.createElement('label');
    label.innerHTML = "Inactive/Active";


    var tdDeleteButton = document.createElement('td');
    var buttonDelete = document.createElement("button");
    buttonDelete.setAttribute("type", "button");
    buttonDelete.setAttribute('value', user.id);
    buttonDelete.addEventListener('click',deleteUser);
    buttonDelete.setAttribute('data-bs-toggle', 'modal');
    buttonDelete.setAttribute('data-bs-target', '#exampleModalCenter');

    buttonDelete.classList.toggle("btn");
    buttonDelete.classList.toggle("btn-danger");
    buttonDelete.innerHTML = "Delete";
    buttonDelete.style.display = 'block';

    divDisable.appendChild(input);
    divDisable.appendChild(label);
    divWriter.appendChild(labelWriter);
    divWriter.appendChild(inputWriter);
    divReader.appendChild(labelReader);
    divReader.appendChild(inputReader);
    divMain.appendChild(divWriter);
    divMain.appendChild(divReader);
    tdOptions.appendChild(divMain);
    tdEditButton.appendChild(buttonEditar);
    tdDeleteButton.appendChild(buttonDelete);
    tdDisableButton.appendChild(divDisable);
    tr.appendChild(th);
    tr.appendChild(tdUserName);
    tr.appendChild(tdEmail);
    tr.appendChild(tdOptions);
    tr.appendChild(tdEditButton);
    tr.appendChild(tdDeleteButton);
    tr.appendChild(tdDisableButton);
    body.appendChild(tr);
}

function switchEvent(){
    let jwt = window.localStorage.getItem("jwt");
    let data = {
        "active": this.checked,
    }
    fetch(api_url + users_endpoint + "/" + this.value, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': "Bearer " + jwt
        }
    }).then(res =>  disable(this.value, res.headers.get("etag"), data))
       .then(response => console.log('Success:', response))
        .catch(error => console.error('Error:', error));

    
    console.log("el "+ this.value +" esta " + this.checked);
}

function disable(id, etag, data){
    let jwt = window.localStorage.getItem("jwt");

    fetch(api_url + users_endpoint + "/" + id, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': "Bearer " + jwt,
            'If-Match': etag,
            'Sec-Fetch-Mode': 'cors'
        }
    }).then(res =>alert('Hecho'))
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
}