var MAXFILELEN = 15; // max length for items in menu
var SERVERNAME = "http://brki164-lnx-10.bucknell.edu:";
var PORT = "9000";
var xhr = new XMLHttpRequest();

//does initial GET to populate recently  edited files list
xhr.open("GET", SERVERNAME+PORT, true);
xhr.responseType="text";
xhr.send();
document.getElementById("choose").addEventListener('click', chooseNewFileEvent);
document.getElementById("currentFile").innerHTML="Current File: "+localStorage.getItem("filename");
document.getElementById("currentFileViewing").innerHTML="Currently Viewing: " + localStorage.getItem("filename");
document.getElementById("viewNotes").addEventListener('click',getNotes);
document.getElementById("editNotes").addEventListener('click',editNotes);


xhr.onreadystatechange = function() {
	//runs when the XMLHttpRequest receives a response
	if (xhr.readyState == 4) {

		if(xhr.responseText.substring(0,4) == "file"){
			//xhr received recently edited file list
			localStorage.setItem("allfiles", xhr.responseText.substring(4));
			doHTML();
		}
		else{
			//xhr received contents of selected file
			localStorage.setItem("viewNotes",xhr.responseText.substring(4));
			document.getElementById("notesFromFile").innerHTML=localStorage.getItem("viewNotes");
  		}
	}
}

function doHTML(){
	//populates the dropdown menu HTML
	var optString;
	var html=listFiles();
	for (var x=0; x<html.length; x++){
		optString= 'option'+ (x).toString();
		if (html[x].length > MAXFILELEN) { // truncate longer filenames
			document.getElementById(optString).outerHTML="<li id ="+optString+"> <a label=" +html[x].substring(0, MAXFILELEN) + "... " + " href='#menu'>" + html[x] + "</a>" +"</li>";

		}
		else { // otherwise, show the whole name
			document.getElementById(optString).outerHTML="<li id ="+optString+"> <a label=" +html[x] +  " href='#menu'>" + html[x] + "</a>" +"</li>";
		}
	}
	while(x<5){ //hides options if there are less than 5 recently edited files
		var optString= 'option'+ (x).toString();
		document.getElementById(optString).outerHTML="<li id ="+optString+" hidden> <a label=" +html[x] +  " href='#menu'>" + html[x] + "</a>" +"</li>";
		x++;
	}
	$("#optionList li").on('click',function(){
		//using jquery to handle clicks on filenames in the recently edited files list
		var fName=$(this).text();
		localStorage.setItem("filename",fName.substring(1));
		document.getElementById("currentFile").innerHTML="Current File: "+localStorage.getItem("filename");
		document.getElementById("drop").innerHTML=localStorage.getItem("filename")+" <span class='caret' ></span>"; 
		document.getElementById("currentFileViewing").innerHTML="Currently Viewing: " + localStorage.getItem("filename");
	});


}	






function listFiles(){
	//gets file list in text form and turns it in to a list
	var file = "";
	var htmlText = "";
	var count=0;
	var len=localStorage.getItem("allfiles").length; 
	for (var i = 0; i < len; i++) {
		if ( (localStorage.getItem("allfiles").charAt(i)) != '\n' ){
	    		file+=localStorage.getItem("allfiles").charAt(i);
		}
		else{
			htmlText+=file + ",";
			file="";
			count++;
			if (count==5){
				break;
			}
		}
	}
	var list = htmlText.split(",");
	list.splice(list.length-1, 1);
	return list;
}

function chooseNewFileEvent(e) {
	//handles click on choose button
	var fileName=document.getElementById("filename").value;
	if (fileName != ''){
		localStorage.setItem("filename", fileName);
	}
}

function editNotes(e){
	//handles click on edit button
	var notes = document.getElementById("notesFromFile").value;
	document.getElementById("editNotes").outerHTML= "<button class='btn btn-success-outline' id='saveNotesChanges'>Save</button><button class='btn btn-warning-outline' id='cancelNotesChanges'>Cancel</button>";
	document.getElementById("saveNotesChanges").addEventListener('click',saveChanges);
	document.getElementById("cancelNotesChanges").addEventListener('click',cancelChanges);
	document.getElementById("notesFromFile").outerHTML= "<textarea rows='4' cols='50' id='notesFromFile'></textarea>";
	document.getElementById("notesFromFile").innerHTML=localStorage.getItem("viewNotes");
}
function saveChanges(e){
	//handles click on save button
	localStorage.setItem("viewNotes",document.getElementById("notesFromFile").value);
	document.getElementById("saveNotesChanges").outerHTML="<button type='button' class='btn btn-primary-outline' id='editNotes'>Edit</button>";
	document.getElementById("cancelNotesChanges").outerHTML="";
	document.getElementById("editNotes").addEventListener('click',editNotes);
	document.getElementById("notesFromFile").outerHTML= "<p class='notes' id='notesFromFile'></p>";
	document.getElementById("notesFromFile").innerHTML=localStorage.getItem("viewNotes");
	overwriteFile();
}
function cancelChanges(e){
	//handles click on cancel button
	document.getElementById("saveNotesChanges").outerHTML="<button class='btn btn-primary-outline' id='editNotes'>Edit</button>";
	document.getElementById("cancelNotesChanges").outerHTML="";
	document.getElementById("editNotes").addEventListener('click',editNotes);
	document.getElementById("notesFromFile").outerHTML= "<p class='notes' id='notesFromFile'></p>";
	document.getElementById("notesFromFile").innerHTML=localStorage.getItem("viewNotes");
}
function overwriteFile(){
	//sends POST to overwrite existing file with changes from View Notes tab edit
	var fileName = localStorage.getItem("filename");
	var text = localStorage.getItem("viewNotes");
	xhr.open("POST", SERVERNAME+PORT,true);
	xhr.send(fileName+"=!--OVERWRITE"+text);
}
function getNotes(){
	//gets contents of the currently selected file
	var fileName = localStorage.getItem("filename");
	if(fileName != ''){
		xhr.open("POST", SERVERNAME+PORT,
		 true);
		xhr.send(fileName+"=!--GETNOTES");
	}
}

