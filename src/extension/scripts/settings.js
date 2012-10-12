var DEFAULT_NOTIFICATION_CLOSEIN = 2


var Settings = {};
Settings.required = function(cb){
	chrome.storage.local.get('settings', function(items){
		cb(items.settings);
	})
}

Settings.save = function(settings, cb){
	chrome.storage.local.set(settings, cb);
}

