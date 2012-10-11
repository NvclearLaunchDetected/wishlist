var Markets = {
	codes: {
		'unknown': 0,
		'auction': 1,
		'gmarket': 2,
		'11st': 3,
		'interpark': 4,
		'cjmall': 5,
		'lotte': 6,
		'lotteimall': 7
	},

	getCode: function(market){
		if(!market)  return this.codes['unknown'];

		return this.codes[market.toLowerCase()] || this.codes['unknown'];
	},

	getMarket: function(code){
	 	for(var m in this.codes){
	 		if(code == this.codes[m]) return m;
	 	}		
	 	return 'unknown';
	}
}