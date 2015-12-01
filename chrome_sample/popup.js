var allfiles;
var fileName;
var MAXFILELEN = 15; // max length for items in menu
var xhr = new XMLHttpRequest();
//sends a request to the server
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
		localStorage.setItem("allfiles", xhr.responseText);
  	}
}
xhr.open("GET", "http://brki164-lnx-19.bucknell.edu:9000", true);
xhr.responseType="text";
xhr.send();
var html=populateHTML();

for (var x=0; x<html.length; x++){
	var optString= 'option'+ (x+1).toString();
	
	if (html[x].length > MAXFILELEN) { // truncate longer filenames
		//document.getElementById(optString).outerHTML="<option id="+optString+" label="+html[x].substring(0, MAXFILELEN)+"...>"+html[x]+"</option>";
		document.getElementById(optString).outerHTML="<a id ="+optString+ " label=" +html[x].substring(0, MAXFILELEN) + "... " + "href='#menu'>" + html[x] + "</a>";

	}
	else { // otherwise, show the whole name
		//document.getElementById(optString).outerHTML="<option id="+optString+" label="+html[x].substring(0, MAXFILELEN)+">"+html[x]+"</option>";
		document.getElementById(optString).outerHTML="<a id ="+optString+ " label=" +html[x].substring(0, MAXFILELEN) + "href='#menu'>" + html[x] + "</a>";
	}
}
while(x<5){
	var optString= 'option'+ (x+1).toString();
	document.getElementById(optString).outerHTML="<option id="+optString+" hidden></option>";
	x++;
}	

document.getElementById("choose").addEventListener('click', clickHandler);
document.getElementById("currentFile").innerHTML="Current File: "+localStorage.getItem("filename");
document.getElementById("submitNotes").addEventListener('click', submitNotes);

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
	else {
		var fName;
		$('#optionList li a').on('click', function(){
			window.alert("hello");
   			fName=($(this).text());
		});
		localStorage.setItem("filename",fName);
		//var strUser = e.options[e.selectedIndex].text;

		/*selected=document.getElementById("selector").value;
		localStorage.setItem("filename", selected);*/
	}
}

function submitNotes(e){
	var notes = document.getElementById("noteText").value;
	fileName = localStorage.getItem("filename");
	xhr.open("POST", "http://brki164-lnx-19.bucknell.edu:9000",
		 true);
	xhr.send(fileName+"="+notes);
}

