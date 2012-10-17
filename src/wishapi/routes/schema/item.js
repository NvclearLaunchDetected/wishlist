var mongoose = require('mongoose');

exports.schema = mongoose.Schema({ 
  market : Number,                                // 마켓정보
  title : String,                                 // 상품명
  price : String,                                 // 가격
  market_item_id : String,                        // 마켓별 상품 아이디
  comments : String,                              // 상품 메모
  url : String,                                   // 상품 VIP url
  imageurl : String,                              // 상품 image url
  user_id : mongoose.Schema.Types.ObjectId,       // 사용자 ID
  brand : String,                                 // 브랜드
  keywords : String,                              // 검색어
  model : String,                                 // 모델
  catalog_id : String,                            // 카탈로그 ID
  reg_date : { type: Date, default: Date.now }    // 생성일
});