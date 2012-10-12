var DEFAULT_SETTINGS = {
	closeNotiSec: 2
}


var Settings = {};
Settings.required = function(cb){
	chrome.storage.local.get('settings', function(items){
		if(!items) return DEFAULT_SETTINGS;
		items.settings = items.settings || DEFAULT_SETTINGS;
		cb(items.settings);
	})
}

Settings.save = function(settings, cb){
	chrome.storage.local.set(settings, cb);
}

