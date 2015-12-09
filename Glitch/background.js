var SERVERNAME = "http://brki164-lnx-10.bucknell.edu:"; //location where the server is running
var PORT = "9000"; //port that the server is running on
var xhr = new XMLHttpRequest();

chrome.runtime.onInstalled.addListener(function() {
	/* Adds an option to the right click menu at install time
	to "Write To File" when either text is highlighted and right clicked on or when
	a media file is right clicked on.
	*/
	var context = ["selection","image","video","audio"]; 
	var title = "Write To File";
	var id = chrome.contextMenus.create({"title": title, "contexts":context,
					     "id": "context" + context});
});

chrome.contextMenus.onClicked.addListener(onClickHandler); //adds a click handler to our right-click option

function onClickHandler(info, tab) {
	// handles a click on our "Write to File" option. 
	var sText;
	if(info.mediaType !== undefined){ //we have selected media
		var i = (info.mediaType).indexOf("image");
		var v = (info.mediaType).indexOf("video");
		var a = (info.mediaType).indexOf("audio");
		if (i>-1 || v>-1 || a>-1) {
			sText = info.srcUrl; //sets sText to the source of the media
		}
	}
	else { //we have selected non-media (text)
		sText = info.selectionText; //sets sText to the selected text
	}
	var fileName = localStorage.getItem("filename"); //gets name of file to write to
	xhr.open("POST", SERVERNAME+PORT,
		 true);
	xhr.send(fileName+"="+sText); //sends a request to the server
}
