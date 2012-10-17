var querystring = require('querystring')
   ,http = require('http');

exports.OAuth2 = function(host, authRequst, tokenRequest){
	var host = host;
	var authRequst = authRequst;
	var tokenRequest = tokenRequest;

	this.AuthorizationRequest = function(get_data, callback){
		var options = {
		   host: host,
		   port: 80,
		   path: authRequst + querystring.stringify(get_data),
		   method: 'GET'/*,
		   headers: {  
		    'Content-Type': 'application/x-www-form-urlencoded',  
		  }*/
		};

		console.log("AuthorizationRequest to : "+host+options.path);

		var req = http.request(options, function(res) {
		  res.setEncoding('utf8');  
		  res.on('data', function (chunk) {
		  	callback(res);
		  }); 
		});

		req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});

		req.end();
	};

	this.AccessTokenRequest = function(post_data, callback){
		var options = {
		   host: host,
		   port: 80,
		   path: tokenRequest,
		   method: 'POST',
		   headers: {  
		    'Content-Type': 'application/x-www-form-urlencoded',
		    'Content-Length': post_data.length,
		  }  
		};

		var req = http.request(options, function(res) {
		  res.setEncoding('utf8');  
		  res.on('data', function (chunk) {  
		    callback(chunk);
		  }); 
		});

		req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});

		req.write(querystring.stringify(post_data));

		req.end();
	};
};