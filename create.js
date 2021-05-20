var typetxt ="";
var imagenUploaded = "";
var imagenURL = "";

function onLoad(){
	console.log("cargado");
	document.getElementById("btn_create").addEventListener("click", clickOnCreate);

	for(let radioOption of document.getElementsByName("RadioOptions")){
		radioOption.addEventListener("click", clickRadio);
	}
	document.getElementById("imagen").addEventListener("change", imageUploaded);
	document.getElementById("url_Image").addEventListener("paste", URLpasted);
	document.getElementById("url_Image").addEventListener("keyup", checkInputEmpty);
	}

function URLpasted(){
	document.getElementById("imagen").disabled = true;
	
}

function checkInputEmpty(){
	if(this.value.length > 1){
		document.getElementById("imagen").disabled = true;
		imagenURL=document.getElementById("url_Image").value;
		console.log("La url es: "+imagenURL);
	}
	else
		document.getElementById("imagen").disabled = false;
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

function clickOnCreate(){
	var newItem = getDataInJSON();
	addToExistingData(newItem);
	console.log(JSON.stringify(newItem));
	window.location.href = "./practica.html";
}

function addToExistingData(newItem){
var aux = window.localStorage.getItem("data");
currentData = JSON.parse(aux);
currentData.push(newItem);
console.log("Los nuevos datos son: " + JSON.stringify(currentData));
window.localStorage.setItem("data", JSON.stringify(currentData));
}

function imageUploaded(){
	const reader = new FileReader();

	reader.addEventListener("load", () => {
		console.log(reader.result);
		imagenUploaded = reader.result;
		document.getElementById("url_Image").disabled = true;
	})
	reader.readAsDataURL(this.files[0]);

}

function getImagen(){
	console.log("imagenURL es: "+imagenURL);
	console.log("imagenUploaded es: "+imagenUploaded);

	if(imagenUploaded.length > 1){
		return imagenUploaded;
	} else {
		return imagenURL;
	}
}

function getDataInJSON(){
	var nombretxt = document.getElementById("nombre_input").value;
	var apellidotxt = document.getElementById("apellido_input").value;
	var fechaCreaciontxt = document.getElementById("fecha_nac_input").value;
	var fechaDefunciontxt = document.getElementById("fecha_def_input").value;
	var participestxt = document.getElementById("participes").value;
	var patrocinadorestxt = document.getElementById("patrocinadores").value;
	var wikitxt = document.getElementById("wiki").value;
	var image = getImagen();
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