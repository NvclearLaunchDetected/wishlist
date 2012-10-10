var auth = new Auth();
function restore(){
	auth.getAuthInfo(function(items){
		$('#inputEmail').val(items.email);
		$('#inputName').val(items.name);
	})
}

$(document).ready(function(){
	//init
	restore();

	//event handlers
	$('#relogin').click(function(){
		auth.clear(function(){
			window.location = 'https://accounts.google.com/Logout?hl=ko&continue=http://www.google.co.kr/?wlo=true';
		})		
	});

	$('#save').click(function(){
		alert('save');
	})
})

