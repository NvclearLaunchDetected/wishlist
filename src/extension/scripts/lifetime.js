var auth = new Auth();

//install시에 google oauth 인증
chrome.runtime.onInstalled.addListener(function(){
	console.log('oninstalled');
	//clear all that already exists.
	chrome.storage.local.clear();
	auth.clear();

	auth.required(function(){
	 	console.log(auth.getAuthInfo());
	}, true);
})
