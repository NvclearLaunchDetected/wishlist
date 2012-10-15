var AboutOAuth2 = require("../about.js").aoa2;

exports.callback = function(req, res){
  var data = req.body;
  console.log(data);
  AboutOAuth2.setCode(data.code);
}