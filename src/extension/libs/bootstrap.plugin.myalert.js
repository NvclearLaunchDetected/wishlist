(function($){
	var createAlert = function(s, t, m){
		var alert = $(document.createElement('div')).addClass(s);
		var closeButton = $(document.createElement('a')).attr('data-dismiss','alert').addClass('close').html('&times;')
		var title = $(document.createElement('h4')).text(t);
		var msg = $(document.createElement('strong')).text(m);
		alert.append(closeButton).append(title).append(msg);
		return alert;
	}

	$.fn.successAlert = function(msg){
		var alert = createAlert('alert alert-success', 'Success', msg);
		$(this).append(alert);
	}

	$.fn.errorAlert = function(msg){
		var alert = createAlert('alert alert-error', 'Error!', msg);
		$(this).append(alert);
	}

})(jQuery);

$(document).ready(function(){
	$('#addToWishlist').click(function(){
		$('#alertdiv').successAlert('test');
	});	
})