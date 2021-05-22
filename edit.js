var typetxt ="";
let api_url = "http://127.0.0.1:8000/api/v1/";
let httpRequest =
        new XMLHttpRequest();
let products_path = "products/";
let persons_path = "persons/";
let entities_path = "entities/";
let etag;
let currentItem;

function onLoad(){
	getSelectedItem();
	document.getElementById("btn_edit").addEventListener("click", editClicked);
	for(let radioOption of document.getElementsByName("RadioOptions")){
		radioOption.addEventListener("click", clickRadio);
	}
}

function getSelectedItem(){
	currentItem = JSON.parse(window.localStorage.getItem("itemToEdit"));
	var isFromCache = setItemFromCache(currentItem.id);
	if(!isFromCache){
		fetchItemFromApi(currentItem.id, currentItem.type);
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
		let response;
		switch(currentItem.type){
			case "product": response = httpRequest.response.product;
			break;
			case "person": response = httpRequest.response.person;
			break;
			case "entity": response = httpRequest.response.entity;
			break;
		}
		etag = httpRequest.getResponseHeader('ETag')
		console.log(etag);
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

function setData(item){
	document.getElementById("nombre_input").value = item.name;
	document.getElementById("fecha_nac_input").value = item.birthDate;
	document.getElementById("fecha_def_input").value = item.deathDate;
	var creadores = "";
	if(item.persons != null){
		item.persons.forEach((creador) =>{
			creadores = creadores + creador + " ";
		});
	}
	document.getElementById("participes").value = creadores;

	var patrocinadores = "";
	if(item.entities != null){
		item.entities.forEach((patrocinador) =>{
			patrocinadores = patrocinadores + patrocinador + " ";
		});
	}

	document.getElementById("patrocinadores").value = patrocinadores;
	document.getElementById("wiki").value = item.wikiUrl;
	document.getElementById("url_Image").value = item.imageUrl;

	setRadio();
}

function setRadio(){
	switch(currentItem.type){
		case "entity": {
			typetxt = "entity";
			document.getElementById("entity_checkbox").checked = true;
			break;}
		case "product": {
			typetxt = "product";
			document.getElementById("product_checkbox").checked = true;
			break;}
		default : {
			typetxt= "person";
			document.getElementById("person_checkbox").checked = true;
		}
	}
}

function editClicked(){
	var data = JSON.parse(window.localStorage.getItem("data"));
	var item = JSON.parse(window.localStorage.getItem("itemToEdit"));

var idOfElementToEdit = item.id;
var objectOfElementToEditFromCache = data.filter(objeto => objeto.id == idOfElementToEdit);
var assetEdited = getDataInJSON();

if(objectOfElementToEditFromCache.length > 0){
	var nombre = objectOfElementToEditFromCache[0].nombre;
	var newData = data.filter(objeto => objeto.id != idOfElementToEdit);
	data = newData;
	data.push(assetEdited);
	console.log("Elementos resultado: " + data);
	window.localStorage.setItem("data", JSON.stringify(newData));
	window.location.reload();
	alert(nombre + " editado");
} else {
	updateAPIService(assetEdited, idOfElementToEdit);
}

}

function updateAPIService(assetEdited, idOfElementToEdit){
	let jwt = window.localStorage.getItem("jwt");
	fetch(api_url+assetEdited.type+"s/"+idOfElementToEdit, {
		method: 'PUT',
		body: JSON.stringify(assetEdited),
		headers:{
			'accept': 'application/json',
			'Content-Type': 'application/json',
			'Accept-Encoding': 'gzip, deflate, br',
			'Authorization': "Bearer " +jwt,
			'If-Match': etag
		  }
	}).then(res => console.log(res.json()))
	.catch(error => console.error('Error:', error))
	.then(response => console.log('Success:', response));
}

function clickRadio(){
	switch(this.value){
		case "product":
		{
		typetxt = "product";
		document.getElementById("participes").disabled = false;
		document.getElementById("patrocinadores").disabled = false;
		break;}
		case "entity":{
		typetxt = "entity";
		document.getElementById("participes").disabled = false;
		document.getElementById("patrocinadores").disabled = true;
		break;}
		default: { 
		typetxt = "person";
		document.getElementById("participes").disabled = true;
		document.getElementById("patrocinadores").disabled = true;
		}
	}
}

function getDataInJSON(){
	var nombretxt = document.getElementById("nombre_input").value;
	var fechaCreaciontxt = document.getElementById("fecha_nac_input").value;
	var fechaDefunciontxt = document.getElementById("fecha_def_input").value;
	var participestxt = document.getElementById("participes").value;
	var patrocinadorestxt = document.getElementById("patrocinadores").value;
	var wikitxt = document.getElementById("wiki").value;
	var image = document.getElementById("url_Image").value;
	var imagentxt = "images/ic_ibm.svg";

	var json = {
		id:"to_"+nombretxt,
		name: nombretxt,
		birthDate: fechaCreaciontxt,
		deathDate: fechaDefunciontxt,
		imageUrl: image,
		wikiUrl: wikitxt,
		persons: null,
		entities: null,
		type: typetxt
	};
	return json;
}