var mongoose = require('mongoose');

exports.schema = mongoose.Schema({ 
  market : Number,                                // 마켓정보 ()
  title : String,                                 // 상품명
  price : String,                                 // 가격
  market_item_id : String,                        // 마켓별 상품 아이디
  url : String,                                   // 상품 VIP url
  user_id : mongoose.Schema.Types.ObjectId,        // 사용자 ID
  reg_date : { type: Date, default: Date.now }     // 생성일
});