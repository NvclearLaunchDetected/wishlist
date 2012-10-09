var auth = chrome.extension.getBackgroundPage().auth;
$(document).ready(function(){
	getProductInfo(function(info){

	})
});



function getProductInfo(cb){
	chrome.extension.sendMessage({msg: 'getProductInfo'}, cb);
}