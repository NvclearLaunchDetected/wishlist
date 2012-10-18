function shortenUrl(url, apikey, cb) {
	$.ajax({
		type: 'POST',
		url: "https://www.googleapis.com/urlshortener/v1/url?key=" + apikey,
		contentType: 'application/json',
		data: JSON.stringify({ longUrl: url })
	})
	.done(function(res) {
		//console.log(">> DATA : " + JSON.stringify(res));
		console.log(">> response : " + res);
		cb(res);
	})
	.fail(function(error) {
		console.log(">> ERROR : " + JSON.stringify(error));
		cb({err:{msg: 'unknown error!'}});
	});
}