// for IE compatibility
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
	var msViewportStyle = document.createElement("style")
		msViewportStyle.appendChild(
				document.createTextNode(
					"@-ms-viewport{width:auto!important}"
					)
				)
		document.getElementsByTagName("head")[0].appendChild(msViewportStyle)
}
function clearListCookies()
{   
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++)
	{   
		var spcook =  cookies[i].split("=");
		deleteCookie(spcook[0]);
	}
	function deleteCookie(cookiename)
	{
		var d = new Date();
		d.setDate(d.getDate() - 1);
		var expires = ";expires="+d;
		var name=cookiename;
		//alert(name);
		var value="";
		document.cookie = name + "=" + value + expires + "; path=/acc/html";                    
	}
}
