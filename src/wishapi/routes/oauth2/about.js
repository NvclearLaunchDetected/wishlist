var oAuth2 = require('oauth2.js');

var AboutOauth2 = function {
	var instance =  null;
	this.getInstance = function(){
		if( this.instance == null){
			return new AboutOauth2();
		}
		else{
			return this.instance;
		}
	}

	var oa2 = new oAuth2.OAuth2("apiv2.about.co.kr", "/OAuth2/Authorize?", "/OAuth2/GetAccessToken");
	var clientID = "iwish";
	var clientSecret = "dkdldnltl!@#";
	var redirectUri = "http://iwish.cloudfoundry.com/OAuth/About/Callback";

	this.constructor = function(){
		AuthorizationRequest();
	}

	var accessToken = null;
	var accessTokenDate = null;
	var expiresIn = null;
	var refreshToken = null;
	var tokenType = null;

	this.getAccessToken = function() {
		return accessToken;
	};

	this.getExpiresIn = function() {
		return expiresIn;
	};

	this.isAccessTokenExpired = function() {
	  return (new Date().valueOf() - accessTokenDate) > expiresIn * 1000;
	};

	var AuthorizationRequest = function(){
		var get_data = {
			response_type : "code",
			client_id : clientID,
			client_secret : clientSecret,
			redirect_uri : redirectUri,
			scope : "",
			state : "IWISH"
		}
		oAuth2.AuthorizationRequest(get_data);
	}

	var code = null;

	this.setCode = function(code){
		this.code = code;
	}

	this.AccessTokenRequest = function(){
		var post_data = {
			grant_type : "authorization_code",
			code  : code ,
			redirect_uri : redirectUri,
			client_id : clientID,
			client_secret : clientSecret,
		}
		oAuth2.AccessTokenRequest(post_data, this.AccessTokenRequestCallback);
	}

	this.AccessTokenRequestCallback = function(res){
		console.log(res);
		this.accessToken = res.AccessToken;
		this.accessTokenDate = new Date().valueOf();
		this.expiresIn = res.expiresIn;
		this.refreshToken = res.RefreshToken;
	};

	this.RefreshTokenRequest = function(){
		var post_data = {
			grant_type : "refresh_code",
			refresh_token  : refresh_token ,
			scope : "",
			client_id : clientID,
			client_secret : clientSecret,
		}
		oAuth2.AccessTokenRequest(post_data, this.AccessTokenRequestCallback);
	};
};

exports.aoa2 = AboutOauth2.getInstance();