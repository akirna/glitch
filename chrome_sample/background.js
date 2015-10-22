var fileName;
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button').addEventListener('click', clickHandler);
});
document.addEventListener('DOMContentLoaded', function () {
  window.alert(document.getElementsByTagName('option'))//.addEventListener('click', optionSelectedHandler);
});
// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
	var context = "selection"; //only appears when text is selected
	var title = "Write To Server";
	var id = chrome.contextMenus.create({"title": title, "contexts":[context],
					     "id": "context" + context});
 
    });

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);
/*var toWrite = "";
var toWriteSpreadsheet= ""; */



// The onClicked callback function.
function clickHandler(e) {
	fileName=document.getElementById("filename").value;
	localStorage.setItem("filename", fileName);
	window.alert(fileName);
}
function optionSelectedHandler(e) {
}
function onClickHandler(info, tab) {
	var xhr = new XMLHttpRequest();
	//sends a request to the server
	xhr.onreadystatechange = function() {
  	if (xhr.readyState == 4) {
    		//JSON.parse does not evaluate the attacker's scripts.
    		//var resp = JSON.parse(xhr.responseText);
		//window.alert(xhr.responseText);
  		}

	}
	/*xhr.open("GET", "http://brki164-lnx-19.bucknell.edu:9000", true);
	xhr.responseType="text"
	xhr.send();*/
	fileName = localStorage.getItem("filename");
	xhr.open("POST", "http://brki164-lnx-19.bucknell.edu:9000",
		 true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var sText = info.selectionText;
	xhr.send(fileName+"="+sText);


};
