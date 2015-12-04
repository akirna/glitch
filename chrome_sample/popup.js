var fName;
var fileName;
var MAXFILELEN = 15; // max length for items in menu
var xhr = new XMLHttpRequest();
//sends a request to the server
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
		if(xhr.responseText.substring(0,4) == "file"){
			localStorage.setItem("allfiles", xhr.responseText.substring(4));
		}
		else{
			localStorage.setItem("viewNotes",xhr.responseText.substring(4));
			document.getElementById("notesFromFile").innerHTML=localStorage.getItem("viewNotes");
  		}
	}
}
xhr.open("GET", "http://brki164-lnx-19.bucknell.edu:9000", true);
xhr.responseType="text";
xhr.send();
var html=populateHTML();

for (var x=0; x<html.length; x++){
	var optString= 'option'+ (x+1).toString();
	
	if (html[x].length > MAXFILELEN) { // truncate longer filenames
		document.getElementById(optString).outerHTML="<li id ="+optString+"> <a label=" +html[x].substring(0, MAXFILELEN) + "... " + " href='#menu'>" + html[x] + "</a>" +"</li>";

	}
	else { // otherwise, show the whole name
		document.getElementById(optString).outerHTML="<li id ="+optString+"> <a label=" +html[x] +  " href='#menu'>" + html[x] + "</a>" +"</li>";
	}
}
while(x<5){
	var optString= 'option'+ (x+1).toString();
	document.getElementById(optString).outerHTML="<li id ="+optString+" hidden> <a label=" +html[x] +  " href='#menu'>" + html[x] + "</a>" +"</li>";
	x++;
}	

document.getElementById("choose").addEventListener('click', clickHandler);
document.getElementById("currentFile").innerHTML="Current File: "+localStorage.getItem("filename");
document.getElementById("submitNotes").addEventListener('click', submitNotes);
document.getElementById("viewNotes").addEventListener('click',getNotes);
document.getElementById("editNotes").addEventListener('click',editNotes);

$("#optionList li").on('click',function(){
	fName=$(this).text();
	localStorage.setItem("filename",fName.substring(1));
	document.getElementById("currentFile").innerHTML="Current File: "+localStorage.getItem("filename");
	document.getElementById("drop").innerHTML=localStorage.getItem("filename") +" <span class=\"caret\"></span>";
});


function populateHTML(){	
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

function clickHandler(e) {
	fileName=document.getElementById("filename").value;
	if (fileName != ''){
		localStorage.setItem("filename", fileName);

	}
}

function submitNotes(e){
	var notes = document.getElementById("noteText").value;
	fileName = localStorage.getItem("filename");
	xhr.open("POST", "http://brki164-lnx-19.bucknell.edu:9000",
		 true);
	xhr.send(fileName+"="+notes);
}
function editNotes(e){
	var notes = document.getElementById("notesFromFile").value;
	document.getElementById("editNotes").outerHTML= "<button id='saveNotesChanges'>Save</button><button id='cancelNotesChanges'>Cancel</button>";
	document.getElementById("saveNotesChanges").addEventListener('click',saveChanges);
	document.getElementById("cancelNotesChanges").addEventListener('click',cancelChanges);
	document.getElementById("notesFromFile").outerHTML= "<textarea rows='4' cols='50' id='notesFromFile'></textarea>";
	document.getElementById("notesFromFile").innerHTML=localStorage.getItem("viewNotes");
}
function saveChanges(e){
	localStorage.setItem("viewNotes",document.getElementById("notesFromFile").value);
	document.getElementById("saveNotesChanges").outerHTML="<button id='editNotes'>Edit</button>";
	document.getElementById("cancelNotesChanges").outerHTML="";
	document.getElementById("editNotes").addEventListener('click',editNotes);
	document.getElementById("notesFromFile").outerHTML= "<p id='notesFromFile'></p>";
	document.getElementById("notesFromFile").innerHTML=localStorage.getItem("viewNotes");
	overwriteFile();
}
function cancelChanges(e){
	document.getElementById("saveNotesChanges").outerHTML="<button id='editNotes'>Edit</button>";
	document.getElementById("cancelNotesChanges").outerHTML="";
	document.getElementById("editNotes").addEventListener('click',editNotes);
	document.getElementById("notesFromFile").outerHTML= "<p id='notesFromFile'></p>";
	document.getElementById("notesFromFile").innerHTML=localStorage.getItem("viewNotes");
}
function overwriteFile(){
	fileName = localStorage.getItem("filename");
	var text = localStorage.getItem("viewNotes");
	xhr.open("POST", "http://brki164-lnx-19.bucknell.edu:9000",true);
	xhr.send(fileName+"=!--OVERWRITE"+text);
}
function getNotes(){
	fileName = localStorage.getItem("filename");
	if(fileName != ''){
		xhr.open("POST", "http://brki164-lnx-19.bucknell.edu:9000",
		 true);
		xhr.send(fileName+"=!--GETNOTES");
	}
}

