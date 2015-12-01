var allfiles;
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
		document.getElementById(optString).outerHTML="<option id="+optString+" label="+html[x].substring(0, MAXFILELEN)+"...>"+html[x]+"</option>";

	}
	else { // otherwise, show the whole name
		document.getElementById(optString).outerHTML="<option id="+optString+" label="+html[x].substring(0, MAXFILELEN)+">"+html[x]+"</option>";
	}
}
while(x<5){
	var optString= 'option'+ (x+1).toString();
	document.getElementById(optString).outerHTML="<option id="+optString+" hidden></option>";
	x++;
}	


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
