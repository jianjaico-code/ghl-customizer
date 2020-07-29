ready(function () {
    generateExpirationCookie();
})

function ready(fn) {
   if (document.readyState != 'loading'){
        fn();
   } else {
        document.addEventListener('DOMContentLoaded', fn);
   }
}


function generateExpirationCookie(){
    var dateNow = new Date();
    var keyword = "expiration";

    dateNow.setDate(dateNow.getDate() + 14);
      
    if(getCookie(keyword).length <= 0) document.cookie = `${keyword}= ${dateNow.toLocaleDateString()}; expires=${dateNow.toUTCString()}`;
    if(new Date().toLocaleDateString == getCookie(keyword)) document.cookie = `${keyword}= ${dateNow.toLocaleDateString()}; expires=${dateNow.toUTCString()}`;
    injectExpirationElement(getCookie(keyword));
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function injectExpirationElement(text){

    var headingElem = document.createElement("div");
    var textVal = document.createTextNode(`This will expire on ${text}`);
    

    headingElem.appendChild(textVal);
    headingElem.style.position = "absolute";
    headingElem.style.zIndex = "999";
    headingElem.style.top = "-1px";
    headingElem.style.left = "-1px";
    headingElem.style.border = "1px solid";
    headingElem.style.margin = "0";
    headingElem.style.fontSize = "15px";
    headingElem.style.padding = "10pt";
    headingElem.style.background = "#104b78";
    headingElem.style.color = "#fff";
    headingElem.style.borderBottomRightRadius = "20pt";
    headingElem.style.filter = "drop-shadow(2px 4px 6px black)";

    document.body.prepend(headingElem);
}