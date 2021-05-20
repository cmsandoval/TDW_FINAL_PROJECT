
let access_url = "http://127.0.0.1:8000/";
let api_url = "http://127.0.0.1:8000/api/v1/";
let httpRequest =
        new XMLHttpRequest();
let httpRequest1 =
        new XMLHttpRequest();
let httpRequest2 =
        new XMLHttpRequest();
let products_cget_endpoint = "products";
let persons_cget_endpoint = "persons";
let entities_cget_endpoint = "entities";

function onLoad(){
	fetchDataSource();
	getForm().addEventListener('submit', (e)=>e.preventDefault());
	if(getLogged()){
		console.log("getLogged es: " + getLogged());
		getForm().style.display = "none";
		document.getElementById("btn_logout").style.display = "contents";
		showDeleteAndCreateButton();
	}
	document.getElementById("btn_logout").addEventListener('submit', (e) =>e.preventDefault());
	for(let form of document.getElementsByTagName("form")){
		for(let element of form){
			if(element.value == "Sign in")
				element.addEventListener("click", doLogin);
		}
			
	}
	for(let links of document.getElementsByTagName("a")){
		links.addEventListener("click", clickedEvent);
	}
	for(let deleteButton of document.getElementsByClassName("btn-danger")){
		deleteButton.addEventListener("click", deleteClicked);
	}
	for(let editButton of document.getElementsByClassName("btn-warning")){
		editButton.addEventListener("click", editClicked);
	}
}

function clickedEvent(event){
console.log(this.id);
saveLinkClicked(this.id);
}

function deleteClicked(){
console.log(this.getAttribute("name") + "se quiere eliminar");
var data = JSON.parse(window.localStorage.getItem("data"));

var idOfElementToDelete = this.getAttribute("name");
var objectOfElementToDelete = data.filter(objeto => objeto.id == idOfElementToDelete);
var nombre = objectOfElementToDelete[0].nombre;
var newData = data.filter(objeto => objeto.id != idOfElementToDelete);
data = newData;
console.log("Elementos restantes: " + newData);
window.localStorage.setItem("data", JSON.stringify(newData));
window.location.reload();
alert(nombre + " eliminado");
}

function editClicked(){
var data = JSON.parse(window.localStorage.getItem("data"));
	data.forEach((item) => {
		if(this.getAttribute("name") == item.id){
			//Save selected item
			let itemClicked = JSON.stringify(item);
			console.log(itemClicked);
			window.localStorage.setItem("selected", itemClicked);
		}
	});
}

function saveLinkClicked(id){
	var data = JSON.parse(window.localStorage.getItem("data"));
	data.forEach((item) => {
		if(id == item.id){
			//Save selected item
			let itemClicked = JSON.stringify(item);
			console.log(itemClicked);
			window.localStorage.setItem("selected", itemClicked);
		}
	});
}


function logout(event, button) {
	var formulario = getForm();
	formulario.style.display="contents";
	hideLogoutAndCreateButton();
	for(let deleteButton of document.getElementsByClassName("btn-danger")){
		deleteButton.style.display = "none";
	}
	for(let editButton of document.getElementsByClassName("btn-warning")){
		editButton.style.display = "none";
	}
	destroyLogged();
}


function showDeleteAndCreateButton(){
	let data = window.localStorage.getItem("userLogged");
	let userLogged = JSON.parse(data);
	if(userLogged.scope.includes('writer')){
		for(let deleteButton of document.getElementsByClassName("btn-danger")){
			deleteButton.style.display = "initial";
		}
		for(let editButton of document.getElementsByClassName("btn-warning")){
			editButton.style.display = "initial";
		}
		var boton = document.getElementById("btn_create");
		boton.style.display = "initial";
		console.log("boton esta "+boton.style.display);
	}
}

function hideLogoutAndCreateButton(){
	document.getElementById("btn_logout").style.display = "none";
	document.getElementById("btn_create").style.display = "none";
}

function saveLogged(email, pass, scopes){
	var userData = JSON.stringify({
		"email": email,
		"pass" : pass,
		"scope": scopes
	});
	window.localStorage.setItem("userLogged", userData);
}

function getLogged(){
	let isLogged = false;
	let data = window.localStorage.getItem("userLogged");
	if(data != null)
		isLogged = true;
	return isLogged;
}

function destroyLogged(){
window.localStorage.removeItem("userLogged");
window.localStorage.removeItem("jwt");
}
function getForm() { return document.forms["login_form"] }

function doLogin() {
	var formData = new FormData()
	var email = getForm()["username"].value;
	var pass = getForm()["password"].value;
	var scope = getForm()["reader"].value + " " + getForm()["writer"].value;
	formData.append("username", email);
	formData.append("password", pass);
	formData.append("scope", scope);
	request(access_url, "access_token", checkLoginStatus, "POST", formData);
}

function checkLoginStatus(){
	if(httpRequest.status === 200){
		successLogin();
	} else if(httpRequest.status === 401){
		alert("UNAUTHORIZED: invalid Authorization header");
	} else {
		let error = httpRequest.response;
		alert(error);
	}
}

function successLogin(){
	var email = getForm()["username"].value;
	var pass = getForm()["password"].value;
	var response = httpRequest.response;
	var jwt = response.access_token;
	var tokens = jwt.split(".");
	var payLoad = JSON.parse(atob(tokens[1]));
	console.log(payLoad);
	var scopes = "";
	payLoad.scopes.forEach((scope) => {
		scopes += scope + " ";
	});
	console.log(scopes);
	window.localStorage.setItem("jwt", jwt);
	saveLogged(email, pass, scopes);
	getForm()["username"].value= "";
	getForm()["password"].value = "";
	getForm().style.display = "none";
	document.getElementById("btn_logout").style.display = "contents";
	fetchElementsFromAPI();
	showDeleteAndCreateButton();
}

function request(url, endpoint, response, method, params){
	httpRequest.open(method,encodeURI(url+endpoint), true);
	httpRequest.responseType = "json";
	httpRequest.onload = response;
	let jwt = window.localStorage.getItem("jwt");
	if(jwt != null){
		httpRequest.setRequestHeader('Authorization', "Bearer " + jwt);
	}
	if(params === undefined){
		httpRequest.send();
	} else {
		httpRequest.send(params);
	}
}

function requestAux1(url, endpoint, response, method, params){
	httpRequest1.open(method,encodeURI(url+endpoint), true);
	httpRequest1.responseType = "json";
	httpRequest1.onload = response;
	let jwt = window.localStorage.getItem("jwt");
	if(jwt != null){
		httpRequest1.setRequestHeader('Authorization', "Bearer " + jwt);
	}
	if(params === undefined){
		httpRequest1.send();
	} else {
		httpRequest1.send(params);
	}
}

function requestAux2(url, endpoint, response, method, params){
	httpRequest2.open(method,encodeURI(url+endpoint), true);
	httpRequest2.responseType = "json";
	httpRequest2.onload = response;
	let jwt = window.localStorage.getItem("jwt");
	if(jwt != null){
		httpRequest2.setRequestHeader('Authorization', "Bearer " + jwt);
	}
	if(params === undefined){
		httpRequest2.send();
	} else {
		httpRequest2.send(params);
	}
}

function fetchElementsFromAPI(){
		request(api_url, products_cget_endpoint, showElementsFromAPI, "GET", undefined);
		requestAux1(api_url, persons_cget_endpoint, showElementsFromAPI, "GET", undefined);
		requestAux2(api_url, entities_cget_endpoint, showElementsFromAPI, "GET", undefined);

}

function showElementsFromAPI(){
	if (this.status === 200){
		var response = this.response;
		switch(this.responseURL){
			case api_url+products_cget_endpoint: {
					response.products.forEach((object) => {
					var product = object.product;
					product.type = "product";
					console.log(product);
					showElements(product);
			});
			}
			break;
			case api_url+persons_cget_endpoint: {
				response.persons.forEach((object) => {
					var person = object.person;
					person.type = "person";
					console.log(person);
					showElements(person);
			});
			}
			break;
			case api_url+entities_cget_endpoint: {
				response.entities.forEach((object) => {
					var entity = object.entity;
					entity.type = "entity";
					console.log(entity);
					showElements(entity);
			});
			}
			break;
		}
		showDeleteAndCreateButton();
	} else {
		alert("No hay conexión");
	}
}

function fetchDataSource(){
	var currentData = window.localStorage.getItem("data");
	if(currentData != null){
		currentData = JSON.parse(currentData);
		currentData.forEach((item) => {
			showElements(item);
		});
	} else {
		window.localStorage.setItem("data", JSON.stringify(data));
		data.forEach((item) => {
			showElements(item);
		});
	}
}

function showElements(item){
	var product_col = document.getElementById("product_col");
	var person_col = document.getElementById("person_col");
	var entity_col = document.getElementById("entity_col");




		var divCol = document.createElement("div");
	divCol.classList.toggle("col");
	var divThumbnail = document.createElement("div");
	divThumbnail.classList.toggle("thumbnail")
	var img = document.createElement("img")
	img.setAttribute('class', "img-thumbnail");
	var p = document.createElement("p");
	var a = document.createElement("a");
	a.classList.toggle("fw-light");
	a.classList.toggle("badge");
	a.classList.toggle("bg-primary");
	a.classList.toggle("text-wraph");
	a.classList.toggle("text-uppercase");
	a.classList.toggle("fs-6");
	a.setAttribute('href', "detail.html");
	a.setAttribute('target', "_blank");
	var button = document.createElement("button");
	button.setAttribute("type", "submit");
	button.classList.toggle("btn");
	button.classList.toggle("btn-danger");
	button.innerHTML = "Eliminar";

	var aEdit = document.createElement("a");
	aEdit.setAttribute("href", "./edit.html");

	var buttonEditar = document.createElement("button");
	buttonEditar.setAttribute("type", "submit");
	buttonEditar.classList.toggle("btn");
	buttonEditar.classList.toggle("btn-warning");
	buttonEditar.innerHTML = "Editar";

	aEdit.appendChild(buttonEditar);
	p.appendChild(a);
	divThumbnail.appendChild(img);
	divThumbnail.appendChild(p);
	divThumbnail.appendChild(button);
	divThumbnail.appendChild(aEdit);
	divCol.appendChild(divThumbnail);
		button.setAttribute("name", item.id);
		buttonEditar.setAttribute("name", item.id);
		a.setAttribute("id", item.id);
		a.setAttribute("title", item.name);
		a.innerHTML = item.name;
		img.setAttribute("alt", item.name);
		img.setAttribute("src", item.imageUrl);
		switch(item.type){
			case "product":product_col.appendChild(divCol);
			break;
			case "person":person_col.appendChild(divCol);
			break;
			default: entity_col.appendChild(divCol);
		}
}

//Users
let user1 = {
	email : "user1@domain.com",
	password: "user1@domain.com"
};

let user2 = {
	email : "user2@domain.com",
	password: "user2@domain.com"
};

let user3 = {
	email : "user3@domain.com",
	password: "user3@domain.com"
};

//DATA

let ibm = {
	id: "to_ibm",
	name: "IBM",
	birthDate: "16 de Junio de 1911",
	deathDate:"12 de agosto de 1981",
	imageUrl: "images/ic_ibm.svg",
	wikiUrl: "https://es.wikipedia.org/wiki/IBM",
	creadores: ["",""],
	patrocinadores: ["",""],
	type: "entity"
};

let sgml = {
	id: "to_sgml",
	name: "SGML",
	birthDate: "1960",
	deathDate:"1998",
	imageUrl: "images/ic_sgml.png",
	wikiUrl: "https://es.wikipedia.org/wiki/SGML#:~:text=El%20lenguaje%20de%20marcado%20generalizado,de%20marcado%20generalizados%20para%20documentos.",
	creadores: ["Charles Goldfarb","Edward Mosher", "Raymond Lorie"],
	patrocinadores: ["IBM"],
	type: "product"
};

let vannerbar = {
	id: "to_vannervar",
	name: "VANNERVAR BUSH",
	birthDate: "11 de Marzo de 1890",
	deathDate:"28 de Junio de 1974",
	imageUrl: "images/ic_vannervar.jpg",
	wikiUrl: "https://es.wikipedia.org/wiki/Vannevar_Bush",
	type: "person"
};


var data = [sgml, vannerbar, ibm];