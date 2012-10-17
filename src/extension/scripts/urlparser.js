function URLParser(){
	var prodreg = /^https*:\/\/[\w]+\.([\w]+)\.[\w]+\.*[\w]*\/*.*(?:\?|&)(?:itemno|goodscode|sc\.prdno|prdno|prdid|item_cd|ItemCode|goods_no|i_code|goods_cd|item_id|PID)=([\w]+).*/i
	
	this.parse = function(url){
		var captures = prodreg.exec(url);
		if(!captures) return null;
	
		return { market: captures[1], itemno: captures[2]};
	}

	this.isValid = function(url){
		var prod = this.parse(url);
		if(!prod) return false;
		
		return prod.market && prod.itemno;
	}
}