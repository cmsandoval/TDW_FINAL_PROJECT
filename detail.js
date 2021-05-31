let api_url = "http://127.0.0.1:8000/api/v1/";
let httpRequest =
        new XMLHttpRequest();
let httpRequest2 =
        new XMLHttpRequest();
let products_path = "products/";
let persons_path = "persons/";
let entities_path = "entities/";

function onLoad(){
	getSelectedItem();
	getAllData();
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

function getAllData(){
	let jwt = window.localStorage.getItem("jwt");

	let httpRequestProducts =
        new XMLHttpRequest();
	let httpRequestPersons =
        new XMLHttpRequest();
	let httpRequestEntities =
        new XMLHttpRequest();

		httpRequestProducts.open('GET',encodeURI(api_url+"products"), true);
		httpRequestProducts.responseType = "json";
		httpRequestProducts.onload = function () {
			if(httpRequestProducts.status == 200){
				httpRequestProducts.response.products.forEach((object)=>{
					setCheckBoxes('products', object.product);
				})
			}
		};
		if(jwt != null){
			httpRequestProducts.setRequestHeader('Authorization', "Bearer " + jwt);
		}

	httpRequestPersons.open('GET',encodeURI(api_url+"persons"), true);
	httpRequestPersons.responseType = "json";
	httpRequestPersons.onload = function() {
		if(httpRequestPersons.status == 200){
			httpRequestPersons.response.persons.forEach((object)=> {
				setCheckBoxes('persons', object.person);
			})
		}
	};
	if(jwt != null){
		httpRequestPersons.setRequestHeader('Authorization', "Bearer " + jwt);
	}

	httpRequestEntities.open('GET',encodeURI(api_url+"entities"), true);
	httpRequestEntities.responseType = "json";
	httpRequestEntities.onload = function () {
		if(httpRequestEntities.status == 200){
			httpRequestEntities.response.entities.forEach((object) => {
				setCheckBoxes('entities', object.entity);
			})
		}
	};
	if(jwt != null){
		httpRequestEntities.setRequestHeader('Authorization', "Bearer " + jwt);
	}

	httpRequestPersons.send();
	httpRequestProducts.send();
	httpRequestEntities.send();
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

function request2(endpoint, response, method, params){
	httpRequest2.open(method,encodeURI(api_url+endpoint), true);
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

function response(){
	if(httpRequest.status === 200){
		var response = getResponseField();
		console.log(response);
		requestRelations();
		setData(response);
	} else if(httpRequest.status === 401){
		alert("UNAUTHORIZED: invalid Authorization header");
	} else {
		let error = httpRequest.response;
		alert(error);
	}
}

function requestRelations(){
	var item = JSON.parse(window.localStorage.getItem("itemSelected"));
	switch(item.type){
		case "entity": requestRelationsEntity(item);
		break;
		case "product": requestRelationsProduct(item);
		break;
		case "person":  requestRelationsPerson(item);
		break;
	}

}



function getResponseField(){
	var item = JSON.parse(window.localStorage.getItem("itemSelected"));
	var result;
	switch(item.type){
		case "entity": result = httpRequest.response.entity;
		break;
		case "product": result = httpRequest.response.product;
		break;
		case "person": result = httpRequest.response.person;
		break;
	}
	return result;
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
	document.getElementById("title").innerHTML = itemSelected.name;
	document.getElementById("image").setAttribute('src', itemSelected.imageUrl);
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

function setCheckBoxes(type, object){
	let mainDiv = document.getElementById('main_div');
	var divCheckBox = document.createElement('div');
    divCheckBox.classList.toggle('form-check');
    var input = document.createElement('input');
    input.classList.toggle('form-check-input');
    input.setAttribute('type', 'checkbox');
	input.setAttribute('name', type);
    input.setAttribute('value', object.id);
    var label = document.createElement('label');
    label.classList.toggle('form-check-label');
    label.setAttribute('for', 'flexCheckDefault');
    label.innerHTML = object.name;
	input.addEventListener('change', checkBoxListener);

	divCheckBox.appendChild(label);
	divCheckBox.appendChild(input);
	mainDiv.appendChild(divCheckBox);
}

function checkBoxListener(){
	console.log(this.value + " " + this.name);
}

//Relations for entities


function requestRelationsEntity(item){
	//request persons
	request(entities_path + item.id + "/" + "persons", responseEntitiesPersons(item), "GET", undefined);
}

function responseEntitiesPersons(item){
	if(httpRequest.status === 200){
		//request products
		console.log(httpRequest.response);
		request2(entities_path + item.id + "/" + "products", responseEntitiesProducts, 'GET', undefined);
	} else {
		console.log(httpRequest.response);
	}
}

function responseEntitiesProducts(){
	if(httpRequest2.status === 200){
		console.log(httpRequest2.response);
	} else {
		console.log(httpRequest2.response);
	}
}

//Relations for products

function requestRelationsProduct(item){
//request entities
request(products_path + item.id + "/" + "entities", responseProductsEntities(item), "GET", undefined);
}

function responseProductsEntities(item){
	if(httpRequest.status === 200){
		//request persons
		console.log(httpRequest.response);
		request2(products_path + item.id + "/" + "persons", responseProductsPersons(item), 'GET', undefined);
	} else {
		console.log(httpRequest.response);
	}
}

function responseProductsPersons(item){
	if(httpRequest2.status === 200){
		console.log(httpRequest2.response);
	} else {
		console.log(httpRequest2.response);
	}
}

//Relations for persons

function requestRelationsPerson(item){
//request entities
request(persons_path + item.id + "/" + "entities", responsePersonsEntities(item), "GET", undefined);

}

function responsePersonsEntities(item){
	if(httpRequest.status === 200){
		//request products
		console.log(httpRequest.response);
		request2(persons_path + item.id + "/" + "products", responsePersonsProducts(item), 'GET', undefined);
	} else {
		console.log(httpRequest.response);
	}
}

function responsePersonsProducts(item){
	if(httpRequest2.status === 200){
		console.log(httpRequest2.response);
	} else {
		console.log(httpRequest2.response);
	}
}