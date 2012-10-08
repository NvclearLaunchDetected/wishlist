function URLParser(){
	var market_sig = /auction|gmarket|11st|interpark|cjmall|lotte|lotteimall/i;
	//마켓 별 product sig는 좀씩 달라용..한개가 아닐수 도 있고...
	var market_product_sig = {
		'auction': /itemno/i,
		'gmarket': /goodscode/i,
		'11st': /prdno/i,
		'interpark': /prdno/i,
		'cjmall': /item_cd/i,
		'lotte': /goods_no/i,
		'lotteimall': /i_code/
	}

	this.isProduct = function(url){
		if(!url) return null;
		var market = url.match(market_sig);
		if(!market || !market.length) return null;

		return url.match(market_product_sig[market[0].toLowerCase()]);
	}
}