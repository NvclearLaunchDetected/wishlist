var querystring = require('querystring'),
    mongoose = require('mongoose'),
    schema = require('./schema'),
    db = mongoose.createConnection('localhost', 'wish'),
    err_code = require('./err_code'),
    exp = require('./share/exporter');


var Item = db.model('Item', schema.item),
    User = db.model('User', schema.user);


function userRequired(authInfo, cb){
  cb(null, {
    __v: 0,
    _id: "5072737558bb130862000001",
    email: "samuel281@gmail.com",
    name: "sungwoo park",
    token: "ya29.AHES6ZQ93UKEcp6URc4R1ROPhye9LpPFD_RmfUWLcwtaKHWag6VpNQ",
    reg_date: "2012-10-15T20:33:05.443Z",
    siteName: "google"
  });
  // if( authInfo == undefined || authInfo.ga == undefined || authInfo.token == undefined){
  //   cb({
  //     err : {
  //       code : err_code.CAN_NOT_GET_AUTH_INFO,
  //       msg : '¬ìš©¸ì¦ •ë³´ê°€ „ë½ ˜ì—ˆµë‹ˆ'
  //     }
  //   });
  //   return;
  // }

  // User.findOne({email:authInfo.ga, token:authInfo.token}, function(err, user){
  //   if (err){
  //     console.log(err);
  //     cb({
  //         err: {
  //           code: err_code.CAN_NOT_FIND_USER,
  //           msg: err.message  
  //       }
  //     });
  //     return;
  //   }

  //   if(!user || !user._id){
  //     console.log('use not registered.');
  //     cb({
  //         err: {
  //           code: err_code.CAN_NOT_FIND_USER,
  //           msg: 'use not registered.'
  //       }
  //     });
  //     return; 
  //   }

  //   cb(null, user);
  // });
}

function itemRequired(_id, cb){
  cb(null, {
    market: 2,
    title: "순둥이 구매하고 사은품 받자/순둥이 베이직 순한 아기 물티슈/국산클라라원단/출산육아/우체국 택배발송",
    price: "15900",
    market_item_id: "166880204",
    comments: "",
    url: "http://item.gmarket.co.kr/detailview/Item.asp?goodscode=166880204&pos_shop_cd=BS&pos_class_cd=111111111&pos_class_kind=T",
    imageurl: "http://gdimg4.gmarket.co.kr/goods_image2/middle_img/166/880/166880204.jpg",
    user_id: "5075346de0c56df51f000001",
    _id: "507bf2c13a3f091648000001",
    __v: 0,
    reg_date: "2012-10-15T11:25:53.440Z"
  })
  // Item.findOne({_id: _id}, function(err, item){
  //   if(err){
  //     console.log(err);
  //     cb({
  //       err: {
  //         code: err_code.CAN_NOT_FIND_ITEM,
  //         msg: err.message
  //       }
  //     });
  //     return;
  //   }

  //   cb(null, item);
  // })
}

exports.getWishList = function(req, res){
  //token ¼ë¡œ user_id ì¡°íšŒ
  var authInfo = querystring.parse(req.get('GX-AUTH'));
  if( authInfo == undefined || authInfo.ga == undefined || authInfo.token == undefined){
    res.json({
      err : {
        code : err_code.CAN_NOT_GET_AUTH_INFO,
        msg : '¬ìš©¸ì¦ •ë³´ê°€ „ë½ ˜ì—ˆµë‹ˆ'
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
            msg : '¬ìš©¸ì¦ •ë³´ê°€ ¼ì¹˜ ˜ì ŠìŠµˆë‹¤.'
          }
        });
        return;
      }

      var market = req.query.market;
      var market_item_id = req.query.market_item_id;
      var page_size = parseInt(req.query.ps, 10);
      var page_no = parseInt(req.params.page_no, 10);

      // ì¡°íšŒ ì¡°ê±´
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
        // range ì¡°ê±´
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
  //token ¼ë¡œ user_id ì¡°íšŒ
  var authInfo = querystring.parse(req.get('GX-AUTH'));
  if( authInfo == undefined || authInfo.ga == undefined || authInfo.token == undefined){
    res.json({
      err : {
        code : err_code.CAN_NOT_GET_AUTH_INFO,
        msg : '¬ìš©¸ì¦ •ë³´ê°€ „ë½ ˜ì—ˆµë‹ˆ'
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
            msg : '¬ìš©¸ì¦ •ë³´ê°€ ¼ì¹˜ ˜ì ŠìŠµˆë‹¤.'
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
  //token ¼ë¡œ user_id ì¡°íšŒ
  var authInfo = querystring.parse(req.get('GX-AUTH'));
  if( authInfo == undefined || authInfo.ga == undefined || authInfo.token == undefined){
    res.json({
      err : {
        code : err_code.CAN_NOT_GET_AUTH_INFO,
        msg : '¬ìš©¸ì¦ •ë³´ê°€ „ë½ ˜ì—ˆµë‹ˆ'
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
            msg : '¬ìš©¸ì¦ •ë³´ê°€ ¼ì¹˜ ˜ì ŠìŠµˆë‹¤.'
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

exports.shareItem = function(req, res){
  console.log('on shareItem')
  //token ¼ë¡œ user_id ì¡°íšŒ
  var shareType = req.get('SHARE');
  var authInfo = querystring.parse(req.get('GX-AUTH'));
  var item_id = req.params.item_id;

  userRequired(authInfo, function(err, user){
    console.log('user required.')
    if(err){
      res.json(err);
      return;
    }

    itemRequired(item_id, function(err, item){
      console.log('item required.')
      if(err){
        res.json(err);
        return;
      }

      var exporter = new exp.Exporter(shareType);
      if(exporter && exporter.err){
        res.json(err);
        return;
      }

      exporter.shareIt(authInfo, user, item, req.body, function(err, result){
        if(err){
          res.json(err);
          return;
        }

        res.json(result);
      })
    })
  })
}