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
		if(!market)  return codes['unknown'];

		return this.codes[market.toLowerCase()] || this.codes['unknown'];
	}

	//not needed yet.
	// getMarket: function(code){

	// }
}