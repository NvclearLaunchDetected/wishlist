var wvpopup = {
	injected: false,
	show: function(tabId) {
		if (wvpopup.injected) return;

		var popup = $(document.createElement('table')).attr("id", "wvpopup_k2tw4YzP50x9BemQp").attr("tid", tabId);
		popup.attr('width','518px').attr('border',0).attr('cellpadding',0).attr('cellspacing',0).addClass('wishlist_popup');
		$(document.getElementsByTagName('body')).append(popup);

		chrome.extension.sendMessage({msg: 'getListPopupHtml'}, function(res){
			popup.append(res.html);

			$('.wvpopup_close').click(function(){
				wvpopup.hide(tabId);
			});

			wvpopup.injected = true;
		});
	},
	hide: function(tabId) {
		if (!wvpopup.injected) return;

		setTimeout(function(){
			$('#wvpopup_k2tw4YzP50x9BemQp').remove();
			wvpopup.injected = false;
		}, 0);
	}
};