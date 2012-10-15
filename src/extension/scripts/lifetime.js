//install시에 google oauth 인증
chrome.runtime.onInstalled.addListener(function(){
	console.log('oninstalled');
	var auth = new Auth();
	auth.required(function(){
	 	console.log(auth.getAuthInfo());
	});
})

chrome.runtime.onSuspend.addListener(function(){
	chrome.storage.local.clear();
})