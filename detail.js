let api_url = "http://127.0.0.1:8000/api/v1/";
let httpRequest =
        new XMLHttpRequest();
let products_path = "products/";
let persons_path = "persons/";
let entities_path = "entities/";

function onLoad(){
	getSelectedItem();
}

function getSelectedItem(){
	var item = JSON.parse(window.localStorage.getItem("itemSelected"));
	let itemSelected = setItemFromCache(item.id);
	if(!itemSelected){
		fetchItemFromApi(item.id, item.type);
	}
}

function fetchItemFromApi(id, type){
	switch(type){
		case "product": request(products_path+id, response, "GET", undefined);
		break;
		case "person": request(persons_path+id, response, "GET",undefined);
		break;
		case "entity": request(entities_path+id, response, "GET", undefined);
		break;
	}
}

function request(endpoint, response, method, params){
	httpRequest.open(method,encodeURI(api_url+endpoint), true);
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

function response(){
	if(httpRequest.status === 200){
		var response = httpRequest.response.product;
		console.log(response);
		setData(response);
	} else if(httpRequest.status === 401){
		alert("UNAUTHORIZED: invalid Authorization header");
	} else {
		let error = httpRequest.response;
		alert(error);
	}
}

function setItemFromCache(id){
	var isInCache =  false;
	var data = JSON.parse(window.localStorage.getItem("data"));
	data.forEach((item) => {
		if(id == item.id){
			isInCache = true;
			console.log(item);
			setData(item);
		}
	});
	return isInCache;
}

function setData(itemSelected){
	document.getElementById("title").innerHTML=itemSelected.name;
	document.getElementById("image").src=itemSelected.imageUrl;
	document.getElementById("wiki").href=itemSelected.wikiUrl;
	var element = document.getElementById("dates_list");
	if(itemSelected.type == "person"){
		var tag = document.createElement("li");
		tag.innerHTML = "<strong>" + itemSelected.birthDate + "</strong>" +
		" - Nacimiento";
		element.appendChild(tag);
	} else {
		var tag = document.createElement("li");
		tag.innerHTML = "<strong>" + itemSelected.birthDate + "</strong>" +
		" - Fundaci&oacuten";
		element.appendChild(tag);
	}
	if(itemSelected.type == "person"){
		var tag = document.createElement("li");
		tag.innerHTML = "<strong>" + itemSelected.deathDate + "</strong>" +
		" - Fallecimiento";
		element.appendChild(tag);
	} else {
		var tag = document.createElement("li");
		tag.innerHTML = "<strong>" + itemSelected.deathDate + "</strong>" +
		" - Fecha de utilidad";
		element.appendChild(tag);
	}

	if(itemSelected.type == "product" || itemSelected.type == "entity"){
		var elementBlockquote = document.getElementById("parrafo");
		var tag = document.createElement("p");
		var creadores = "";
		itemSelected.persons.forEach((creador) =>{
			creadores = creadores + creador + " ";
		});
		tag.innerHTML = creadores + "participaron en el desarrollo de "+itemSelected.name+".";
		elementBlockquote.appendChild(tag);
	}

	if(itemSelected.type == "product"){
		var elementBlockquote = document.getElementById("parrafo");
		var tag = document.createElement("p");
		var patrocinadores = "";
		itemSelected.entities.forEach((patrocinador) =>{
			patrocinadores = patrocinadores + patrocinador + " ";
			console.log(patrocinadores);
		});
		tag.innerHTML = patrocinadores + "participaron en el desarrollo de "+itemSelected.name+".";
		elementBlockquote.appendChild(tag);
	}
}