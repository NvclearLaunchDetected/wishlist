var auth = new Auth();

function restore(){
	auth.required(function(){
		var authInfo = auth.getAuthInfo();
		$('#inputEmail').val(authInfo.email);
		$('#inputName').val(authInfo.name);		
	})

	chrome.storage.local.get('settings', function(data){
		if(data.settings.useBanner) $('#useBanner').attr('checked','checked');
	})
}

function save(){
	chrome.storage.local.remove('settings');
	chrome.storage.local.set({ settings: $('#settings').serializeJSON()});
}

$(document).ready(function(){
	//init
	restore();

	//event handlers
	$('#relogin').click(function(){
		auth.clear();
		window.location = 'https://accounts.google.com/Logout?hl=ko&continue=http://www.google.co.kr/?wlo=true';
	});

	$('#save').click(save);
})

