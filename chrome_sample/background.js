// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
	var context = "selection"; //only appears when text is selected
	var title = "Write To X";
	var id = chrome.contextMenus.create({"title": title, "contexts":[context],
					     "id": "context" + context});
 
    });

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);
var toWrite = "";
var toWriteSpreadsheet= ""; 
// The onClicked callback function.
function onClickHandler(info, tab) {
	var xhr = new XMLHttpRequest();
	//sends a request to the server?
	xhr.open("GET", "/server.java", true);
	xhr.onreadystatechange = function() {
  	if (xhr.readyState == 4) {
    		// JSON.parse does not evaluate the attacker's scripts.
    		var resp = JSON.parse(xhr.responseText);
		window.alert(resp);
  		}

	}
	xhr.send();
	var sText = info.selectionText;
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
