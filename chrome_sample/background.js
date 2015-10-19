var fileName;
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button').addEventListener('click', clickHandler);
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
	window.alert(fileName);
	//i think the page is being reloaded here, that's why it's not working
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
	/*xhr.open("GET", "http://brki164-lnx-19.bucknell.edu:9000/index.html", true);
	xhr.responseType="text"
	xhr.send();*/
	xhr.open("POST", "http://brki164-lnx-19.bucknell.edu:9000",
		 true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var sText = info.selectionText;
	xhr.send(fileName+"="+sText);

	//window.alert(toWrite);
	//window.alert(toWriteSpreadsheet);
	if(!(isNaN(Number(sText)))){
		//window.alert("Number!");
		toWriteSpreadsheet=toWriteSpreadsheet + " " + Number(sText) +"\n";
	}
	else{
		//window.alert("String!");
		toWrite=toWrite+ " "+ sText + "\n";
	}	
};
