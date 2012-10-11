function setAddMode(){
	//배너도 여기에

	chrome.extension.sendMessage(null, {msg: 'setAddMode'}, function(res){
		console.log(res.msg);
	});
}


function ensureNotExists(mi, cb){
	chrome.extension.sendMessage(null, {msg: 'isExist', market_code: Markets.getCode(mi.market), itemno: mi.itemno}, function(res){
		if(!res) return;
		if(res.err) {
			console.log(res.err.msg);
			return;
		}

		if(res.exist) return;

		cb();		
	});
}

$(document).ready(function(){
	var marketInfo = urlparser.parse(window.location.href);
	if(!marketInfo) return;
	ensureNotExists(marketInfo, setAddMode);
})