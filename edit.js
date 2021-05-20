var typetxt ="";
let api_url = "http://127.0.0.1:8000/api/v1/";
let httpRequest =
        new XMLHttpRequest();
let products_path = "products/";
let persons_path = "persons/";
let entities_path = "entities/";

function onLoad(){
	getSelectedItem();
	document.getElementById("btn_edit").addEventListener("click", editClicked);
	for(let radioOption of document.getElementsByName("RadioOptions")){
		radioOption.addEventListener("click", clickRadio);
	}
}

function getSelectedItem(){
	var item = JSON.parse(window.localStorage.getItem("itemToEdit"));
	var isFromCache = setItemFromCache(item.id);
	if(!isFromCache){
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

function setData(item){
	document.getElementById("nombre_input").value = item.name;
	var apellido = "";
	if(typeof item.apellido !== "undefined"){
		apellido = item.apellido;
	}
	document.getElementById("apellido_input").value = apellido;
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

	setRadio(item);
}

function setRadio(item){
	switch(item.type){
		case "entity": {document.getElementById("entity_checkbox").checked = true;break;}
		case "product": {document.getElementById("product_checkbox").checked = true;break;}
		default : document.getElementById("person_checkbox").checked = true;
	}
}

function editClicked(){
	var data = JSON.parse(window.localStorage.getItem("data"));
	var item = JSON.parse(window.localStorage.getItem("itemToEdit"));

var idOfElementToEdit = item.id;
var objectOfElementToEditFromCache = data.filter(objeto => objeto.id == idOfElementToEdit);
if(objectOfElementToEditFromCache.length > 0){
	var nombre = objectOfElementToEditFromCache[0].nombre;
	var newData = data.filter(objeto => objeto.id != idOfElementToEdit);
	data = newData;
	objetoEditado = getDataInJSON();
	data.push(objetoEditado);
	console.log("Elementos resultado: " + data);
	window.localStorage.setItem("data", JSON.stringify(newData));
	window.location.reload();
	alert(nombre + " editado");
} else {
	updateAPIService(item);
}

}

function updateAPIService(item){
	
}

function clickRadio(){
	switch(this.value){
		case "product":
		{
		typetxt = "product";
		document.getElementById("participes").disabled = false;
		document.getElementById("patrocinadores").disabled = false;
		document.getElementById("apellido_input").disabled = true;
		break;}
		case "entity":{
		typetxt = "entity";
		document.getElementById("participes").disabled = false;
		document.getElementById("patrocinadores").disabled = true;
		document.getElementById("apellido_input").disabled = true;
		break;}
		default: { 
		typetxt = "person";
		document.getElementById("participes").disabled = true;
		document.getElementById("patrocinadores").disabled = true;
		document.getElementById("apellido_input").disabled = false;
		}
	}
}

function getDataInJSON(){
	var nombretxt = document.getElementById("nombre_input").value;
	var apellidotxt = getApellido();
	var fechaCreaciontxt = document.getElementById("fecha_nac_input").value;
	var fechaDefunciontxt = document.getElementById("fecha_def_input").value;
	var participestxt = document.getElementById("participes").value;
	var patrocinadorestxt = document.getElementById("patrocinadores").value;
	var wikitxt = document.getElementById("wiki").value;
	var image = document.getElementById("url_Image").value;
	var imagentxt = "images/ic_ibm.svg";

	var json = {
		id:"to_"+nombretxt,
		nombre: nombretxt +" "+ apellidotxt,
		fechaCreacion: fechaCreaciontxt,
		fechaDefuncion: fechaDefunciontxt,
		imagen: image,
		wiki: wikitxt,
		type: typetxt
	};
	return json;
}

function getApellido() {
	var resul = document.getElementById("apellido_input").value;
	if(resul !== undefined){
		return resul;
	} else {
		return "";
	}
}