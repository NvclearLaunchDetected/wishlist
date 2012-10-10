var url = window.location.href;
if(url.indexOf('wlo=true') > 0){
	var redirect = chrome.extension.getURL('options.html');
	window.location = redirect;
}
