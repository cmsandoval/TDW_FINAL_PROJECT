let itemSelected;

function onLoad(){
	getSelectedItem();
	setData();
}

function getSelectedItem(){
	var stringItemSelected = window.localStorage.getItem("selected");
	itemSelected = JSON.parse(stringItemSelected);
}

function setData(){
	document.getElementById("title").innerHTML=itemSelected.nombre;
	document.getElementById("image").src=itemSelected.imagen;
	document.getElementById("wiki").href=itemSelected.wiki;
	var element = document.getElementById("dates_list");
	if(itemSelected.type == "person"){
		var tag = document.createElement("li");
		tag.innerHTML = "<strong>" + itemSelected.fechaCreacion + "</strong>" +
		" - Nacimiento";
		element.appendChild(tag);
	} else {
		var tag = document.createElement("li");
		tag.innerHTML = "<strong>" + itemSelected.fechaCreacion + "</strong>" +
		" - Fundaci&oacuten";
		element.appendChild(tag);
	}
	if(itemSelected.type == "person"){
		var tag = document.createElement("li");
		tag.innerHTML = "<strong>" + itemSelected.fechaDefuncion + "</strong>" +
		" - Fallecimiento";
		element.appendChild(tag);
	} else {
		var tag = document.createElement("li");
		tag.innerHTML = "<strong>" + itemSelected.fechaDefuncion + "</strong>" +
		" - Fecha de utilidad";
		element.appendChild(tag);
	}

	if(itemSelected.type == "product" || itemSelected.type == "entity"){
		var elementBlockquote = document.getElementById("parrafo");
		var tag = document.createElement("p");
		var creadores = "";
		itemSelected.creadores.forEach((creador) =>{
			creadores = creadores + creador + " ";
		});
		tag.innerHTML = creadores + "participaron en el desarrollo de "+itemSelected.nombre+".";
		elementBlockquote.appendChild(tag);
	}

	if(itemSelected.type == "product"){
		var elementBlockquote = document.getElementById("parrafo");
		var tag = document.createElement("p");
		var patrocinadores = "";
		itemSelected.patrocinadores.forEach((patrocinador) =>{
			patrocinadores = patrocinadores + patrocinador + " ";
			console.log(patrocinadores);
		});
		tag.innerHTML = patrocinadores + "participaron en el desarrollo de "+itemSelected.nombre+".";
		elementBlockquote.appendChild(tag);
	}
}