let itemSelected;
var typetxt ="";

function onLoad(){
	getSelectedItem();
	setData();
	document.getElementById("btn_edit").addEventListener("click", editClicked);
	for(let radioOption of document.getElementsByName("RadioOptions")){
		radioOption.addEventListener("click", clickRadio);
	}
}

function getSelectedItem(){
	var stringItemSelected = window.localStorage.getItem("selected");
	itemSelected = JSON.parse(stringItemSelected);
}

function setData(){
	document.getElementById("nombre_input").value = itemSelected.nombre;
	var apellido = "";
	if(typeof itemSelected.apellido !== "undefined"){
		apellido = itemSelected.apellido;
	}
	document.getElementById("apellido_input").value = apellido;
	document.getElementById("fecha_nac_input").value = itemSelected.fechaCreacion;
	document.getElementById("fecha_def_input").value = itemSelected.fechaDefuncion;
	var creadores = "";
	if(typeof itemSelected.creadores !== "undefined"){
		itemSelected.creadores.forEach((creador) =>{
			creadores = creadores + creador + " ";
		});
	}
	document.getElementById("participes").value = creadores;

	var patrocinadores = "";
	if(typeof itemSelected.patrocinadores !== "undefined"){
		itemSelected.patrocinadores.forEach((patrocinador) =>{
			patrocinadores = patrocinadores + patrocinador + " ";
		});
	}

	document.getElementById("patrocinadores").value = patrocinadores;
	document.getElementById("wiki").value = itemSelected.wiki;
	document.getElementById("url_Image").value = itemSelected.imagen;

	setRadio();
}

function setRadio(){
	switch(itemSelected.type){
		case "entity": {document.getElementById("entity_checkbox").checked = true;break;}
		case "product": {document.getElementById("product_checkbox").checked = true;break;}
		default : document.getElementById("person_checkbox").checked = true;
	}
}

function editClicked(){
	var data = JSON.parse(window.localStorage.getItem("data"));

var idOfElementToEdit = itemSelected.id;
var objectOfElementToEdit = data.filter(objeto => objeto.id == idOfElementToEdit);
var nombre = objectOfElementToEdit[0].nombre;
var newData = data.filter(objeto => objeto.id != idOfElementToEdit);
data = newData;
objetoEditado = getDataInJSON();
data.push(objetoEditado);
console.log("Elementos resultado: " + data);
window.localStorage.setItem("data", JSON.stringify(newData));
window.location.reload();
alert(nombre + " editado");
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
	if(typeof resul !== "undefined"){
		return resul;
	} else {
		return "";
	}
}