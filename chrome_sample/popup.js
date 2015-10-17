/*function test(){
var elem = document.getElementById("test");
elem.innerHTML = "succeed";
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
if (xhr.readyState == 4) {
    //JSON.parse does not evaluate the attacker's scripts.
    //var resp = JSON.parse(xhr.responseText);
	window.alert(xhr.responseText);
  	}
}
xhr.open("POST", "http://brki164-lnx-18.bucknell.edu:9000",true);
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.send("hello.txt=testing");
}*/
function awesome() {
  // Do something awesome!
}

function totallyAwesome() {
  // do something TOTALLY awesome!
}

function awesomeTask() {
  awesome();
  totallyAwesome();
}



function main() {

}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button').addEventListener('click', clickHandler);
});
