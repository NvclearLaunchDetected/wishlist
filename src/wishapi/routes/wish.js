var querystring = require('querystring'),
    mongoose = require('mongoose'),
    schema = require('./schema'),
    db = mongoose.createConnection('localhost', 'wish'),
    err_code = require('./err_code');


var Item = db.model('Item', schema.item),
    User = db.model('User', schema.user);

exports.getWishList = function(req, res){
  //token 으로 user_id 조회
  var authInfo = querystring.parse(req.get('GX-AUTH'));
  if( authInfo == undefined || authInfo.ga == undefined || authInfo.token == undefined){
    res.json({
      err : {
        code : err_code.CAN_NOT_GET_AUTH_INFO,
        msg : '사용자 인증 정보가 누락 되었습니다.'
      }
    });
    return;
  }

  var userFindCallback = function(err, user){
    if (err){
      console.log(err);
      res.json({
        err : {
          code : err_code.CAN_NOT_FIND_USER,
          msg : err.message
        }
      });
    }
    else {
      var market = req.query.market;
      var market_item_id = req.query.market_item_id;

      // 조회 조건
      var query = {};

      if (market != undefined)
      {
        query.market = market;
      }
      if( market_item_id != undefined)
      {
        query.market_item_id = market_item_id;
      }

      query.user_id = user._id;

      var itemFindCallback = function(err, items){
        if(err){
            console.log(err);
            res.json({
              err : {
                code : err_code.CAN_NOT_FIND_ITEM,
                msg : err.message
              }
            });
          }
          else {
            res.json({
              data : items
            });
          }
      };

      Item.find(query, itemFindCallback);
    }
  };

  User.findOne({email:authInfo.ga, token:authInfo.token}, userFindCallback);
};

exports.addItem = function(req, res) {
  //token 으로 user_id 조회
  var authInfo = querystring.parse(req.get('GX-AUTH'));
  if( authInfo == undefined || authInfo.ga == undefined || authInfo.token == undefined){
    res.json({
      err : {
        code : err_code.CAN_NOT_GET_AUTH_INFO,
        msg : '사용자 인증 정보가 누락 되었습니다.'
      }
    });
    return;
  }

  var userFindCallback = function(err, user){
    if (err){
      console.log(err);
      res.json({
        err : {
          code : err_code.CAN_NOT_FIND_USER,
          msg : err.message
        }
      });
    }
    else {
      var info = req.body;

      var item = new Item({
        market : info.market,
        title : info.title,
        price : info.price,
        market_item_id : info.market_item_id,
        url : info.url,
        user_id : mongoose.Types.ObjectId(user._id)
      });

      var itemCallback = function(err){
        if(err){
          console.log(err);
          res.json({
            err : {
              code : err_code.CAN_NOT_SAVE_ITEM,
              msg : err.message
            }
          });
        }
        else{
          res.json({
            data : true
          });
        }
      };

      item.save(itemCallback);
    }
  }

  User.findOne({email:authInfo.ga, token:authInfo.token}, userFindCallback);
};

exports.removeItem = function(req, res) {
  //token 으로 user_id 조회
  var authInfo = querystring.parse(req.get('GX-AUTH'));
  if( authInfo == undefined || authInfo.ga == undefined || authInfo.token == undefined){
    res.json({
      err : {
        code : err_code.CAN_NOT_GET_AUTH_INFO,
        msg : '사용자 인증 정보가 누락 되었습니다.'
      }
    });
    return;
  }

  var userFindCallback = function(err, user){
    if (err){
      console.log(err);
      res.json({
        err : {
          code : err_code.CAN_NOT_FIND_USER,
          msg : err.message
        }
      });
    }
    else {
      var item_id = mongoose.Types.ObjectId(req.params.item_id);

      var itemRemoveCallback = function(err){
        if(err){
          console.log(err);
          res.json({
            err : {
              code : err_code.CAN_NOT_REMOVE_ITEM,
              msg : err.message
            }
          });
        }
        else{
          res.json({
            data : true
          });
        }
      };

      Item.remove({_id:item_id, user_id:user._id}, itemRemoveCallback);
    }
  }

  User.findOne({email:authInfo.ga, token:authInfo.token}, userFindCallback);
};