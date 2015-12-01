var fileName;
var selected;


var xhr = new XMLHttpRequest();
//sends a request to the server
xhr.onreadystatechange = function() {
if (xhr.readyState == 4) {
	localStorage.setItem("allfiles", xhr.responseText);
  	}
}

document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('button').addEventListener('click', clickHandler);
	document.getElementById("currentFile").innerHTML="Current File: "+localStorage.getItem("filename");
	
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
		else{
			n = (info.mediaType).indexOf("video");
			if (n>-1) {
				sText = info.srcUrl;
			}
			else{
				n = (info.mediaType).indexOf("audio");
				if (n>-1) {
					sText = info.srcUrl;
				}
			}
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
