let api_url = "http://127.0.0.1:8000/api/v1/";
let httpRequest =
        new XMLHttpRequest();
let httpRequest2 =
        new XMLHttpRequest();
let products_path = "products/";
let persons_path = "persons/";
let entities_path = "entities/";
var item;

function onLoad(){
	getSelectedItem();
	getAllData();
}

function getSelectedItem(){
	item = JSON.parse(window.localStorage.getItem("itemSelected"));
	let itemSelected = setItemFromCache(item.id);
	if(!itemSelected){
		fetchItemFromApi(item.id, item.type);
	}
}

function fetchItemFromApi(id, type){
	switch(type){
		case "product": {
			request(products_path+id, response, "GET", undefined);}
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

	switch(item.type){
		case "person": {
			httpRequestProducts.send();
			httpRequestEntities.send();}
		break;
		case "product": {
			httpRequestPersons.send();
			httpRequestEntities.send();
		}
		break;
		case "entity": {
			httpRequestPersons.send();
			httpRequestProducts.send();
		}
		break;
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

function request3(endpoint, response, method, params){
	httpRequest3.open(method,encodeURI(api_url+endpoint), true);
	httpRequest3.responseType = "json";
	httpRequest3.onload = response;
	let jwt = window.localStorage.getItem("jwt");
	if(jwt != null){
		httpRequest3.setRequestHeader('Authorization', "Bearer " + jwt);
	}
	if(params === undefined){
		httpRequest3.send();
	} else {
		httpRequest3.send(params);
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
	} else if(httpRequest.status === 209){
		console.log("resource updated");
	}
	else {
		let error = httpRequest.response;
		alert(error);
	}
}

function requestRelations(){
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
	input.setAttribute('id', object.name);
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
	
		switch(item.type){
			case "product": updateProductRelation(this.checked, this.value, this.name);
			break;
			case "entity": updateEntityRelation(this.checked, this.value, this.name);
			break;
			case "persons": updatePersonsRelation(this.checked, this.value, this.name);
		}
	

}

function updatePersonsRelation(checked, id, type){
	if(checked){
		switch(type){
			case "entities": request(persons_path+item.id+ "/" + entities_path + "add/" + id, response, 'PUT', undefined);
			break;
			case "products": request(persons_path+item.id+ "/" + products_path + "add/" + id, response, 'PUT', undefined);
			break;
		}
	} else {
		switch(type){
			case "entities": request(persons_path+item.id+ "/" + entities_path + "rem/" + id, response, 'PUT', undefined);
			break;
			case "products": request(persons_path+item.id+ "/" + products_path + "rem/" + id, response, 'PUT', undefined);
			break;
		}
	}
}

function updateEntityRelation(checked, id, type){
	if(checked){
		switch(type){
			case "products": request(entities_path+item.id+ "/" + products_path + "add/" + id, response, 'PUT', undefined);
			break;
			case "persons": request(entities_path+item.id+ "/" + persons_path + "add/" + id, response, 'PUT', undefined);
			break;
		}
	} else {
		switch(type){
			case "products": request(entities_path+item.id+ "/" + products_path + "rem/" + id, response, 'PUT', undefined);
			break;
			case "persons": request(entities_path+item.id+ "/" + products_path + "rem/" + id, response, 'PUT', undefined);
			break;
		}
	}
}

function updateProductRelation(checked, id, type){
	if(checked){
		switch(type){
			case "entities": request(products_path+item.id+ "/" + entities_path + "add/" + id, response, 'PUT', undefined);
			break;
			case "persons": request(products_path+item.id+ "/" + persons_path + "add/" + id, response, 'PUT', undefined);
			break;
		}
	} else {
		switch(type){
			case "entities": request(products_path+item.id+ "/" + entities_path + "rem/" + id, response, 'PUT', undefined);
			break;
			case "persons": request(products_path+item.id+ "/" + persons_path + "rem/" + id, response, 'PUT', undefined);
			break;
		}
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

//Relations for entities


function requestRelationsEntity(item){
	let jwt = window.localStorage.getItem("jwt");

Promise.all([
	fetch(api_url+entities_path + item.id + "/" + "products",
	{
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': "Bearer " + jwt
        }
    }),
	fetch(api_url+entities_path + item.id + "/" + "persons",
	{
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': "Bearer " + jwt
        }
    })
]).then(function(responses){
	return Promise.all(responses.map(function (response){
		return response.json();
	}));
}).then(function (data){
	console.log(data);
	setRelation(data);
}).catch(function(error){
	console.log(error);
});
}

function setRelation(data){
	data.forEach((it) => {
		if(it.products != null){
			it.products.forEach((item) => {
				console.log(item.product);
				setChecked(item.product);
			})
		} else if(it.persons != null){
			it.persons.forEach((item) => {
				console.log(item.person);
				setChecked(item.person);
			})
		} else if(it.entities != null){
			it.entities.forEach((item) => {
				console.log(item.entity);
				setChecked(item.entity);
			})
		}
	})
}

function setChecked(object){
	var checkbox = document.getElementById(object.name);
	if(checkbox != undefined){
		checkbox.checked = true;
	}
}

//Relations for products

function requestRelationsProduct(item){
let jwt = window.localStorage.getItem("jwt");

Promise.all([
	fetch(api_url+products_path + item.id + "/" + "entities",
	{
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': "Bearer " + jwt
        }
    }),
	fetch(api_url+products_path + item.id + "/" + "persons",
	{
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': "Bearer " + jwt
        }
    })
]).then(function(responses){
	return Promise.all(responses.map(function (response){
		return response.json();
	}));
}).then(function (data){
	console.log(data);
	setRelation(data);
}).catch(function(error){
	console.log(error);
});

}

//Relations for persons

function requestRelationsPerson(item){
	let jwt = window.localStorage.getItem("jwt");

	Promise.all([
		fetch(api_url+persons_path + item.id + "/" + "entities",
		{
			method: 'GET',
			headers: {
				'accept': 'application/json',
				'Content-Type': 'application/json',
				'Accept-Encoding': 'gzip, deflate, br',
				'Authorization': "Bearer " + jwt
			}
		}),
		fetch(api_url+persons_path + item.id + "/" + "products",
		{
			method: 'GET',
			headers: {
				'accept': 'application/json',
				'Content-Type': 'application/json',
				'Accept-Encoding': 'gzip, deflate, br',
				'Authorization': "Bearer " + jwt
			}
		})
	]).then(function(responses){
		return Promise.all(responses.map(function (response){
			return response.json();
		}));
	}).then(function (data){
		console.log(data);
		setRelation(data);
	}).catch(function(error){
		console.log(error);
	});
}
