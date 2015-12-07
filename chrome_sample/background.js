var fileName;
var selected;
var xhr = new XMLHttpRequest();

//sends a request to the server
/*xhr.onreadystatechange = function() {
if (xhr.readyState == 4) {
	localStorage.setItem("allfiles", xhr.responseText);
  	}
}*/

// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
	var context = ["selection","image","video","audio"]; //only appears when text is selected
	var title = "Write To Server";
	var id = chrome.contextMenus.create({"title": title, "contexts":context,
					     "id": "context" + context});
 
});


// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);
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
	xhr.open("POST", "http://brki164-lnx-10.bucknell.edu:9000",
		 true);
	xhr.send(fileName+"="+sText);

}
