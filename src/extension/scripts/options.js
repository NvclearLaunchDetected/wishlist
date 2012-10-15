var auth = new Auth();

function restore(){
	auth.required(function(){
		var authInfo = auth.getAuthInfo();
		$('#inputEmail').val(authInfo.email);
		$('#inputName').val(authInfo.name);		
	})

	Settings.required(function(settings){
		$('#closeNotiSec').val(settings.closeNotiSec);
		if(settings.notUseNoti)	$('#notUseNoti').attr('checked','checked');
	});
}


function save(cb){
	var settings = {settings: $('#settings').serializeJSON()};
	chrome.storage.local.set(settings, cb(settings));
}

$(document).ready(function(){
	//init
	restore();

	//event handlers
	$('#relogin').click(function(){
		auth.clear();
		chrome.storage.local.remove('wish', function(){
			//remove wishlist cache.
			window.location = 'https://accounts.google.com/Logout?hl=ko&continue=http://www.google.co.kr/?wlo=true';	
		});
	});

	$('#save').click(function(){
		save(function(saved){
			if(saved.settings.notUseNoti){
				alert('옵션을 저장했습니다.');
				return;
			}

			chrome.extension.sendMessage(null, { msg: 'popNotification' , title: '옵션', body: '옵션을 저장했습니다.'});
		})
	})
})

