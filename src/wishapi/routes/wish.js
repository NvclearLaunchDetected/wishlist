var querystring = require('querystring'),
    mongoose = require('mongoose'),
    schema = require('./schema'),
    db = mongoose.createConnection('localhost', 'wish'),
    err_code = require('./err_code');


var Item = db.model('Item', schema.item),
    User = db.model('User', schema.user);

exports.getWishList = function(req, res){
  //token ºÎ°ú user_id Ï°∞Ìöå
  var authInfo = querystring.parse(req.get('GX-AUTH'));
  if( authInfo == undefined || authInfo.ga == undefined || authInfo.token == undefined){
    res.json({
      err : {
        code : err_code.CAN_NOT_GET_AUTH_INFO,
        msg : '¨Ïö©∏Ï¶ù ïÎ≥¥Í∞Ä ÑÎùΩ òÏóàµÎãà'
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
      if(user == undefined || user._id == undefined){
        res.json({
          err : {
            code : err_code.CAN_NOT_FIND_USER,
            msg : '¨Ïö©∏Ï¶ù ïÎ≥¥Í∞Ä ºÏπò òÏ äÏäµàÎã§.'
          }
        });
        return;
      }

      var market = req.query.market;
      var market_item_id = req.query.market_item_id;
      var page_size = parseInt(req.query.ps, 10);
      var page_no = parseInt(req.params.page_no, 10);

      // Ï°∞Ìöå Ï°∞Í±¥
      var query = {user_id:user._id};

      if (market != undefined)
      {
        query.market = market;
      }
      if( market_item_id != undefined)
      {
        query.market_item_id = market_item_id;
      }

      var itemCountCallback = function(err, count){
      if(err){
        console.log(err);
        res.json({
          err : {
            code : err_code.CAN_NOT_COUNT_ITEM,
            msg : err.message
          }
        });
      }
      else{
        // range Ï°∞Í±¥
        var range = {sort:{reg_date:-1}};

        page_size = (page_size == undefined || page_size == 0 || isNaN(page_size))?10:page_size;
        range.limit = page_size;
        
        if(page_no != undefined && !isNaN(page_no)){
          range.skip = page_no * page_size;
        }
        else {
          page_no = 0;
        }

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
                t : count,
                p : page_no,
                s : page_size,
                items : items
              });
            }
        };

        var select = "market title price market_item_id comments url imageurl brand keywords model reg_date";

        Item.find(query, select, range, itemFindCallback);
      }
    };

    Item.count(query, itemCountCallback);
    }
  };

  User.findOne({email:authInfo.ga, token:authInfo.token}, userFindCallback);
};

exports.addItem = function(req, res) {
  //token ºÎ°ú user_id Ï°∞Ìöå
  var authInfo = querystring.parse(req.get('GX-AUTH'));
  if( authInfo == undefined || authInfo.ga == undefined || authInfo.token == undefined){
    res.json({
      err : {
        code : err_code.CAN_NOT_GET_AUTH_INFO,
        msg : '¨Ïö©∏Ï¶ù ïÎ≥¥Í∞Ä ÑÎùΩ òÏóàµÎãà'
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
      if(user == undefined || user._id == undefined){
        res.json({
          err : {
            code : err_code.CAN_NOT_FIND_USER,
            msg : '¨Ïö©∏Ï¶ù ïÎ≥¥Í∞Ä ºÏπò òÏ äÏäµàÎã§.'
          }
        });
        return;
      }

      var info = req.body;
      var price = parseInt(info.price, 10);
      var item = new Item({
        market : info.market,
        title : info.title,
        price : isNaN(price)?0:price,
        market_item_id : info.market_item_id,
        comments : info.comments,
        url : info.url,
        imageurl : info.imageurl,
        brand : info.brand,
        keywords : info.keywords,
        model : info.model,
        user_id : user._id
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
          res.json({});
        }
      };

      item.save(itemCallback);
    }
  }

  User.findOne({email:authInfo.ga, token:authInfo.token}, userFindCallback);
};

exports.removeItem = function(req, res) {
  //token ºÎ°ú user_id Ï°∞Ìöå
  var authInfo = querystring.parse(req.get('GX-AUTH'));
  if( authInfo == undefined || authInfo.ga == undefined || authInfo.token == undefined){
    res.json({
      err : {
        code : err_code.CAN_NOT_GET_AUTH_INFO,
        msg : '¨Ïö©∏Ï¶ù ïÎ≥¥Í∞Ä ÑÎùΩ òÏóàµÎãà'
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
      if(user == undefined || user._id == undefined){
        res.json({
          err : {
            code : err_code.CAN_NOT_FIND_USER,
            msg : '¨Ïö©∏Ï¶ù ïÎ≥¥Í∞Ä ºÏπò òÏ äÏäµàÎã§.'
          }
        });
        return;
      }

      var item_id = req.params.item_id;

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
          res.json({});
        }
      };

      Item.remove({_id:item_id, user_id:user._id}, itemRemoveCallback);
    }
  }

  User.findOne({email:authInfo.ga, token:authInfo.token}, userFindCallback);
};