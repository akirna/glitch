var fileName;
var selected;
var allfiles;


var xhr = new XMLHttpRequest();
//sends a request to the server
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    		//JSON.parse does not evaluate the attacker's scripts.
    		//var resp = JSON.parse(xhr.responseText);
	localStorage.setItem("allfiles", xhr.responseText);

  	}
}

xhr.open("GET", "http://brki164-lnx-19.bucknell.edu:9000", true);
xhr.responseType="text";
xhr.send();

document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('button').addEventListener('click', clickHandler);
	document.getElementById("currentFile").innerHTML="Current File: "+localStorage.getItem("filename");
	var html=populateHTML();
	for (var x=0; x<html.length; x++){
		var optString= 'option'+ (x+1).toString();
		document.getElementById(optString).innerHTML=html[x];
	}
	while(x<5){
		var optString= 'option'+ (x+1).toString();
		document.getElementById(optString).outerHTML="<option id="+optString+" hidden></option>";
		x++;
	}	

});

// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
	var context = ["selection","image","video","audio"]; //only appears when text is selected
	var title = "Write To Server";
	var id = chrome.contextMenus.create({"title": title, "contexts":context,
					     "id": "context" + context});
 
});




// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

function populateHTML(){	
	var file = "";
	var htmlText = "";
	var count=0;
	var len=localStorage.getItem("allfiles").length;

	for (var i = 0; i < len; i++) {
		console.log(htmlText);
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

// The onClicked callback function.
function clickHandler(e) {
	fileName=document.getElementById("filename").value;
	if (fileName != ''){
		localStorage.setItem("filename", fileName);
	}
	else {
		selected=document.getElementById("selector").value;
		localStorage.setItem("filename", selected);
	}
}

function onClickHandler(info, tab) {
	var sText;
	if(info.mediaType !== undefined){
		var n = (info.mediaType).indexOf("image");
		if (n>-1) {
			sText = info.srcUrl;
		}
	}
	else {
		sText = info.selectionText;
	}
	fileName = localStorage.getItem("filename");
	xhr.open("POST", "http://brki164-lnx-19.bucknell.edu:9000",
		 true);
	xhr.send(fileName+"="+sText);

}
