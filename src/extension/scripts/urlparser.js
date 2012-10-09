function URLParser(){
	var prodreg = /^https*:\/\/[\w]+\.([\w]+)\.[\w]+\.*[\w]*\/*.*\?.*(?:itemno|goodscode|prdno|item_cd|goods_no|i_code)=([\w]+).*/i
	

	this.parse = function(url){
		var captures = prodreg.exec(url);
		return { market: captures[1], itemno: captures[2]};
	}

	this.isValid = function(url){
		var prod = this.parse(url);
		return prod.market && prod.itemno;
	}
}